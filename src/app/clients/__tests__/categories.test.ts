import request from 'supertest';
import server, { db } from '../../../server';
import Categories from '../../../data/models/clients/Categories.model';
import { Users } from '../../../data/models/security';
import { JwtAdapter } from '../../../utils';

describe('Categories Integration Tests', () => {
    let authToken: string;
    let userId: string;

    beforeAll(async () => {
        await db.connect();
        const uniqueSuffix = Date.now().toString();
        const user = await Users.create({
            us_username: `cat_tester_${uniqueSuffix}`,
            us_password_encriptado: 'hashed_password',
            us_nombre_completo: 'Category Tester',
            us_estado: true
        });
        userId = user.us_id;
        authToken = (await JwtAdapter.generateToken({ id: userId }))!;
    });

    afterAll(async () => {
        if (userId) {
            await Users.destroy({ where: { us_id: userId } });
        }
        await db.disconnect();
    });

    describe('GET /api/categories', () => {
        it('should return 200 and a list of categories', async () => {
            const response = await request(server)
                .get('/api/categories')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return 500 if database fails', async () => {
            jest.spyOn(Categories, 'findAll').mockRejectedValueOnce(new Error('DB Error'));
            const response = await request(server)
                .get('/api/categories')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('POST /api/categories', () => {
        it('should return 201 and the created category', async () => {
            const catName = `Cat_${Date.now()}`;
            const catDesc = 'Description';

            const response = await request(server)
                .post('/api/categories')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    ca_name: catName,
                    ca_descripcion: catDesc
                });

            expect(response.status).toBe(201);
            expect(response.body.ca_name).toBe(catName);

            // Clean up
            await Categories.destroy({ where: { ca_id: response.body.ca_id } });
        });

        it('should return 400 if validation fails', async () => {
            const response = await request(server)
                .post('/api/categories')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    // Missing name
                    ca_descripcion: 'Desc'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });

        it('should return 500 if database fails', async () => {
            jest.spyOn(Categories, 'create').mockRejectedValueOnce(new Error('DB Error'));
            const response = await request(server)
                .post('/api/categories')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    ca_name: 'ErrorCat',
                    ca_descripcion: 'ErrorDesc'
                });
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/categories/:id', () => {
        it('should return 200 and the category if it exists', async () => {
            const cat = await Categories.create({
                ca_name: `CatGet_${Date.now()}`,
                ca_descripcion: 'GetDesc'
            } as any);

            const response = await request(server)
                .get(`/api/categories/${cat.ca_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.ca_id).toBe(cat.ca_id);

            await cat.destroy();
        });

        it('should return 404 if category does not exist', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000000';
            const response = await request(server)
                .get(`/api/categories/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/categories/:id', () => {
        it('should return 200 and the updated category', async () => {
            const cat = await Categories.create({
                ca_name: `CatOld_${Date.now()}`,
                ca_descripcion: 'OldDesc'
            } as any);

            const newName = `CatNew_${Date.now()}`;
            const response = await request(server)
                .put(`/api/categories/${cat.ca_id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ ca_name: newName });

            expect(response.status).toBe(200);
            expect(response.body.ca_name).toBe(newName);

            await cat.destroy();
        });

        it('should return 500 if update fails', async () => {
            const cat = await Categories.create({
                ca_name: `CatUpErr_${Date.now()}`,
                ca_descripcion: 'Err'
            } as any);
            jest.spyOn(Categories.prototype, 'update').mockRejectedValueOnce(new Error('Update Error'));

            const response = await request(server)
                .put(`/api/categories/${cat.ca_id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ ca_name: 'Fail' });

            expect(response.status).toBe(500);
            await cat.destroy();
        });
    });

    describe('DELETE /api/categories/:id', () => {
        it('should return 200 and delete the category', async () => {
            const cat = await Categories.create({
                ca_name: `CatDel_${Date.now()}`,
                ca_descripcion: 'Del'
            } as any);

            const response = await request(server)
                .delete(`/api/categories/${cat.ca_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Category deleted');

            const deleted = await Categories.findByPk(cat.ca_id);
            expect(deleted).toBeNull();
        });

        it('should return 500 if delete fails', async () => {
            const cat = await Categories.create({
                ca_name: `CatDelErr_${Date.now()}`,
                ca_descripcion: 'Err'
            } as any);
            jest.spyOn(Categories.prototype, 'destroy').mockRejectedValueOnce(new Error('Delete Error'));

            const response = await request(server)
                .delete(`/api/categories/${cat.ca_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(500);
            jest.restoreAllMocks();
            await cat.destroy();
        });
    });
});
