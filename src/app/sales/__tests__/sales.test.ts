import request from 'supertest';
import server, { db } from '../../../server';
import Sales from '../../../data/models/sales/Sales.model';
import SaleDetails from '../../../data/models/sales/SaleDetails.model';
import InventoryMovements from '../../../data/models/logistics/InventoryMovements.model';
import Products from '../../../data/models/clients/Products.model';
import Categories from '../../../data/models/clients/Categories.model';
import Clients from '../../../data/models/clients/Clients.model';
import { Users } from '../../../data/models/security';
import { JwtAdapter } from '../../../utils';

describe('Sales Integration Tests', () => {
    let authToken: string;
    let userId: string;
    let categoryId: string;
    let productId: string;
    let clientId: string;

    beforeAll(async () => {
        await db.connect();
        const uniqueSuffix = Date.now().toString();
        const user = await Users.create({
            us_username: `sales_tester_${uniqueSuffix}`,
            us_password_encriptado: 'hashed_password',
            us_nombre_completo: 'Sales Tester',
            us_estado: true
        });
        userId = user.us_id;
        authToken = (await JwtAdapter.generateToken({ id: userId }))!;

        // Dependencies
        const category = await Categories.create({
            ca_name: `SaleCat_${uniqueSuffix}`,
            ca_descripcion: 'Sales Cat'
        } as any);
        categoryId = category.ca_id;

        const product = await Products.create({
            pr_name: `SaleProd_${uniqueSuffix}`,
            pr_price: 20.00,
            pr_availability: true,
            pr_category_id: categoryId,
            pr_stock: 100 // Ensure stock for sale
        });
        productId = product.pr_id;

        const client = await Clients.create({
            cl_nombre: `Client_${uniqueSuffix}`,
            cl_identificacion: `RUC${uniqueSuffix}`,
            cl_telefono: '0999999999',
            cl_correo: `client_${uniqueSuffix}@test.com`,
            cl_preferencias_opcionales: ''
        } as any);
        clientId = client.cl_id;
    });

    afterAll(async () => {
        // ORDEN DE LIMPIEZA: De lo más dependiente a lo más independiente
        // 1. Limpiar todos los movimientos y detalles que pudieron quedar huérfanos
        await InventoryMovements.destroy({ where: {} });
        await SaleDetails.destroy({ where: {} });

        // 2. Limpiar las ventas (Dependen de Client y User)
        if (userId) await Sales.destroy({ where: { sa_user_id: userId } });

        // 3. Limpiar los padres
        if (clientId) await Clients.destroy({ where: { cl_id: clientId } });
        if (productId) await Products.destroy({ where: { pr_id: productId } });
        if (categoryId) await Categories.destroy({ where: { ca_id: categoryId } });

        // 4. El usuario al final
        if (userId) await Users.destroy({ where: { us_id: userId } });

        await db.disconnect();
    });

    describe('POST /api/sales/sale/:clientId/product/:productId', () => {
        it('should return 201 and create a sale with details and movement', async () => {
            const total = 40.00;
            const response = await request(server)
                .post(`/api/sales/sale/${clientId}/product/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    sa_fecha: new Date().toISOString(),
                    sa_total: total,
                    sa_medio_de_pago: 'EFECTIVO',
                    details: [{ sd_cantidad: 2, sd_precio_unitario: 20.00 }]
                });

            expect(response.status).toBe(201);
            // CORRECCIÓN: Convertir a número o comparar con string
            expect(Number(response.body.sa_total)).toBe(total);
            expect(response.body.sa_user_id).toBe(userId);

            const saleId = response.body.sa_id;
            // Limpieza inmediata post-test para no bloquear el afterAll
            await InventoryMovements.destroy({ where: { im_referencia: `Venta ${saleId}` } });
            await SaleDetails.destroy({ where: { sd_sale_id: saleId } });
            await Sales.destroy({ where: { sa_id: saleId } });
        });

        it('should return 400 if validation fails', async () => {
            const response = await request(server)
                .post(`/api/sales/sale/${clientId}/product/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    sa_fecha: 'bad-date',
                    sa_total: -100,
                    sa_medio_de_pago: '',
                    details: []
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });

        it('should return 500 if database fails', async () => {
            jest.spyOn(Sales, 'create').mockRejectedValueOnce(new Error('DB Error'));
            const response = await request(server)
                .post(`/api/sales/sale/${clientId}/product/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    sa_fecha: new Date().toISOString(),
                    sa_total: 100,
                    sa_medio_de_pago: 'CARD',
                    details: [{ sd_cantidad: 1, sd_precio_unitario: 100 }]
                });
            expect(response.status).toBe(500);
        });
    });

    describe('GET /api/sales', () => {
        it('should return 200 and list sales', async () => {
            const response = await request(server)
                .get('/api/sales')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /api/sales/:id', () => {
        it('should return 200 and the sale', async () => {
            const sale = await Sales.create({
                sa_client_id: clientId,
                sa_user_id: userId,
                sa_fecha: new Date(),
                sa_total: 100,
                sa_medio_de_pago: 'CASH'
            });

            const response = await request(server)
                .get(`/api/sales/${sale.sa_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.sa_id).toBe(sale.sa_id);

            await sale.destroy();
        });

        it('should return 404 if not found', async () => {
            const response = await request(server)
                .get(`/api/sales/00000000-0000-0000-0000-000000000000`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(404);
        });
    });
});
