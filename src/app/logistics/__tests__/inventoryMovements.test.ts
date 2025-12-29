import request from 'supertest';
import server, { db } from '../../../server';
import InventoryMovements from '../../../data/models/logistics/InventoryMovements.model';
import Products from '../../../data/models/clients/Products.model';
import Categories from '../../../data/models/clients/Categories.model';
import { Users } from '../../../data/models/security';
import { JwtAdapter } from '../../../utils';

describe('Inventory Movements Integration Tests', () => {
    let authToken: string;
    let userId: string;
    let categoryId: string;
    let productId: string;

    beforeAll(async () => {
        await db.connect();
        const uniqueSuffix = Date.now().toString();
        const user = await Users.create({
            us_username: `inv_tester_${uniqueSuffix}`,
            us_password_encriptado: 'hashed_password',
            us_nombre_completo: 'Inventory Tester',
            us_estado: true
        });
        userId = user.us_id;
        authToken = (await JwtAdapter.generateToken({ id: userId }))!;

        // Dependencies
        const category = await Categories.create({
            ca_name: `InvCat_${uniqueSuffix}`,
            ca_descripcion: 'Inventory Cat'
        } as any);
        categoryId = category.ca_id;

        const product = await Products.create({
            pr_name: `InvProd_${uniqueSuffix}`,
            pr_price: 15.00,
            pr_availability: true,
            pr_category_id: categoryId
        } as any);
        productId = product.pr_id;
    });

    afterAll(async () => {
        if (productId) {
            await InventoryMovements.destroy({ where: { im_product_id: productId } });
            await Products.destroy({ where: { pr_id: productId } });
        }
        if (categoryId) await Categories.destroy({ where: { ca_id: categoryId } });
        if (userId) await Users.destroy({ where: { us_id: userId } });
        await db.disconnect();
    });

    describe('POST /api/inventory-movements/movement/:productId', () => {
        it('should return 201 and create an inventory movement', async () => {
            const movementType = 'ENTRADA';
            const quantity = 50;
            const reference = `REF_${Date.now()}`;

            const response = await request(server)
                .post(`/api/inventory-movements/movement/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    im_tipo: movementType,
                    im_cantidad: quantity,
                    im_referencia: reference
                });

            expect(response.status).toBe(201);
            expect(response.body.im_tipo).toBe(movementType);
            expect(response.body.im_product_id).toBe(productId);

            await InventoryMovements.destroy({ where: { im_id: response.body.im_id } });
        });

        it('should return 400 if validation fails (invalid type)', async () => {
            const response = await request(server)
                .post(`/api/inventory-movements/movement/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    im_tipo: 'INVALID',
                    im_cantidad: 10,
                    im_referencia: 'REF'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });

        it('should return 500 if database fails', async () => {
            const spy = jest.spyOn(InventoryMovements, 'create').mockRejectedValueOnce(new Error('DB Error'));
            const response = await request(server)
                .post(`/api/inventory-movements/movement/${productId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    im_tipo: 'ENTRADA',
                    im_cantidad: 10,
                    im_referencia: 'REF_ERR'
                });
            expect(response.status).toBe(500);
            spy.mockRestore();
        });
    });

    describe('GET /api/inventory-movements', () => {
        it('should return 200 and list inventory movements', async () => {
            const response = await request(server)
                .get('/api/inventory-movements')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return 500 if getAll fails', async () => {
            const spy = jest.spyOn(InventoryMovements, 'findAll').mockRejectedValueOnce(new Error('DB Error'));
            const response = await request(server)
                .get('/api/inventory-movements')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(500);
            spy.mockRestore();
        });
    });
});
