import request from 'supertest';
import server, { db } from '../../../server';
import Products from '../../../data/models/clients/Products.model';
import Categories from '../../../data/models/clients/Categories.model';
import { Users } from '../../../data/models/security';
import { JwtAdapter } from '../../../utils';

describe('Products Integration Tests', () => {
    let authToken: string;
    let userId: string;
    let categoryId: string;

    beforeAll(async () => {
        await db.connect();
        const uniqueSuffix = Date.now().toString();
        const user = await Users.create({
            us_username: `prod_tester_${uniqueSuffix}`,
            us_password_encriptado: 'hashed_password',
            us_nombre_completo: 'Product Tester',
            us_estado: true
        });
        userId = user.us_id;
        authToken = (await JwtAdapter.generateToken({ id: userId }))!;

        // Create a category for products
        const category = await Categories.create({
            ca_name: `ProdCat_${uniqueSuffix}`,
            ca_descripcion: 'For Products'
        } as any);
        categoryId = category.ca_id;
    });

    afterAll(async () => {
        if (categoryId) {
            // Products cascade might handle this, but explicit cleanup is safer
            await Products.destroy({ where: { pr_category_id: categoryId } });
            await Categories.destroy({ where: { ca_id: categoryId } });
        }
        if (userId) {
            await Users.destroy({ where: { us_id: userId } });
        }
        await db.disconnect();
    });

    describe('GET /api/products', () => {
        it('should return 200 and a list of products', async () => {
            const response = await request(server)
                .get('/api/products')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return 500 if database fails', async () => {
            jest.spyOn(Products, 'findAll').mockRejectedValueOnce(new Error('DB Error'));
            const response = await request(server)
                .get('/api/products')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('POST /api/products/category/:categoryId', () => {
        it('should return 201 and the created product', async () => {
            const prodName = `Prob_${Date.now()}`;
            const prodPrice = 100.50;

            const response = await request(server)
                .post(`/api/products/category/${categoryId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    pr_name: prodName,
                    pr_price: prodPrice,
                    pr_availability: true
                });

            expect(response.status).toBe(201);
            expect(response.body.pr_name).toBe(prodName);
            expect(response.body.pr_category_id).toBe(categoryId);

            await Products.destroy({ where: { pr_id: response.body.pr_id } });
        });

        it('should return 400 if validation fails (negative price)', async () => {
            const response = await request(server)
                .post(`/api/products/category/${categoryId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    pr_name: 'BadPrice',
                    pr_price: -10,
                    pr_availability: true
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });

        it('should return 500 if database fails', async () => {
            jest.spyOn(Products, 'create').mockRejectedValueOnce(new Error('DB Error'));
            const response = await request(server)
                .post(`/api/products/category/${categoryId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    pr_name: 'ErrProd',
                    pr_price: 10,
                    pr_availability: true
                });
            expect(response.status).toBe(500);
        });
    });

    describe('GET /api/products/:id', () => {
        it('should return 200 and the product', async () => {
            const prod = await Products.create({
                pr_name: `GetProd_${Date.now()}`,
                pr_price: 50,
                pr_availability: true,
                pr_category_id: categoryId
            });

            const response = await request(server)
                .get(`/api/products/${prod.pr_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.pr_id).toBe(prod.pr_id);

            await prod.destroy();
        });

        it('should return 404 if product not found', async () => {
            const response = await request(server)
                .get(`/api/products/00000000-0000-0000-0000-000000000000`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/products/:id', () => {
        it('should return 200 and update product', async () => {
            const prod = await Products.create({
                pr_name: `OldName_${Date.now()}`,
                pr_price: 50,
                pr_availability: true,
                pr_category_id: categoryId
            });

            const newName = `NewName_${Date.now()}`;
            const response = await request(server)
                .put(`/api/products/${prod.pr_id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ pr_name: newName });

            expect(response.status).toBe(200);
            expect(response.body.pr_name).toBe(newName);

            await prod.destroy();
        });

        it('should return 500 if update fails', async () => {
            const prod = await Products.create({
                pr_name: `UpdErr_${Date.now()}`,
                pr_price: 50,
                pr_availability: true,
                pr_category_id: categoryId
            });
            jest.spyOn(Products.prototype, 'update').mockRejectedValueOnce(new Error('Update Error'));

            const response = await request(server)
                .put(`/api/products/${prod.pr_id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ pr_name: 'Fail' });

            expect(response.status).toBe(500);
            await prod.destroy();
        });
    });

    describe('DELETE /api/products/:id', () => {
        it('should return 200 and delete product', async () => {
            const prod = await Products.create({
                pr_name: `DelProd_${Date.now()}`,
                pr_price: 50,
                pr_availability: true,
                pr_category_id: categoryId
            });

            const response = await request(server)
                .delete(`/api/products/${prod.pr_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            const deleted = await Products.findByPk(prod.pr_id);
            expect(deleted).toBeNull();
        });

        it('should return 500 if delete fails', async () => {
            const prod = await Products.create({
                pr_name: `DelErr_${Date.now()}`,
                pr_price: 50,
                pr_availability: true,
                pr_category_id: categoryId
            });
            jest.spyOn(Products.prototype, 'destroy').mockRejectedValueOnce(new Error('Delete Error'));

            const response = await request(server)
                .delete(`/api/products/${prod.pr_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(500);
            jest.restoreAllMocks();
            await prod.destroy();
        });
    });
});
