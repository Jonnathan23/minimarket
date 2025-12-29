import request from 'supertest';
import server, { db } from '../../../server';
import Purchases from '../../../data/models/providers/Purchases.model';
import Providers from '../../../data/models/providers/Providers.model';
import PurchaseDetails from '../../../data/models/providers/PurchaseDetails.model';
import Products from '../../../data/models/clients/Products.model';
import Categories from '../../../data/models/clients/Categories.model';
import { Users } from '../../../data/models/security';
import { JwtAdapter } from '../../../utils';

describe('Purchases Integration Tests', () => {
    let authToken: string;
    let userId: string;
    let categoryId: string;
    let productId: string;
    let providerId: string;

    beforeAll(async () => {
        await db.connect();
        const uniqueSuffix = Date.now().toString();
        const user = await Users.create({
            us_username: `pur_tester_${uniqueSuffix}`,
            us_password_encriptado: 'hashed_password',
            us_nombre_completo: 'Purchase Tester',
            us_estado: true
        });
        userId = user.us_id;
        authToken = (await JwtAdapter.generateToken({ id: userId }))!;

        // Dependencies
        const category = await Categories.create({
            ca_name: `PurCat_${uniqueSuffix}`,
            ca_descripcion: 'For Purchase Tests'
        } as any);
        categoryId = category.ca_id;

        const product = await Products.create({
            pr_name: `PurProd_${uniqueSuffix}`,
            pr_price: 10.00,
            pr_availability: true,
            pr_category_id: categoryId
        } as any);
        productId = product.pr_id;

        const provider = await Providers.create({
            po_nombre: `PurProv_${uniqueSuffix}`,
            po_RUC_NIT: `NIT${uniqueSuffix}`,
            po_direccion: 'Address',
            po_telefono: '0999999999',
            po_correo: `pur_${uniqueSuffix}@test.com`
        } as any);
        providerId = provider.po_id;
    });

    afterAll(async () => {
        // ORDEN DE LIMPIEZA: De hijos a padres
        try {
            await PurchaseDetails.destroy({ where: {} });
            await Purchases.destroy({ where: {} });

            if (providerId) await Providers.destroy({ where: { po_id: providerId } });
            if (productId) await Products.destroy({ where: { pr_id: productId } });
            if (categoryId) await Categories.destroy({ where: { ca_id: categoryId } });
            if (userId) await Users.destroy({ where: { us_id: userId } });
        } catch (error) {
            console.error("Error en limpieza de Purchases:", error);
        } finally {
            await db.disconnect();
        }
    });

    describe('POST /api/purchases/purchase/:providerId/product/:productId', () => {
        it('should return 201 and create purchase with details', async () => {
            const totalEsperado = 50.00;

            const response = await request(server)
                .post(`/api/purchases/purchase/${providerId}/product/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    pu_fecha: new Date().toISOString(),
                    pu_total: totalEsperado,
                    details: [
                        {
                            pd_cantidad: 5,
                            pd_precio_unitario: 10.00
                        }
                    ]
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('pu_id');
            // FIX: Conversión de string a Number para el DECIMAL de Postgres
            expect(Number(response.body.pu_total)).toBe(totalEsperado);
            expect(response.body.pu_provider_id).toBe(providerId);

            // Limpieza manual de la compra creada para evitar ruido en otros tests
            const purchaseId = response.body.pu_id;
            await PurchaseDetails.destroy({ where: { pd_purchase_id: purchaseId } });
            await Purchases.destroy({ where: { pu_id: purchaseId } });
        });

        it('should return 500 if database fails', async () => {
            const spy = jest.spyOn(Purchases, 'create').mockRejectedValueOnce(new Error('DB Error'));
            const response = await request(server)
                .post(`/api/purchases/purchase/${providerId}/product/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    pu_fecha: new Date().toISOString(),
                    pu_total: 100,
                    details: [{ pd_cantidad: 1, pd_precio_unitario: 100 }]
                });
            expect(response.status).toBe(500);
            spy.mockRestore();
        });
    });

    describe('GET /api/purchases', () => {
        it('should return 200 and list purchases', async () => {
            const response = await request(server)
                .get('/api/purchases')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /api/purchases/:id', () => {
        it('should return 200 and the purchase', async () => {
            const pur = await Purchases.create({
                pu_fecha: new Date(),
                pu_total: 100,
                pu_provider_id: providerId
            });

            const response = await request(server)
                .get(`/api/purchases/${pur.pu_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.pu_id).toBe(pur.pu_id);

            await pur.destroy();
        });

        it('should return 404 if not found', async () => {
            const response = await request(server)
                .get(`/api/purchases/00000000-0000-0000-0000-000000000000`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(404);
        });
    });
});
