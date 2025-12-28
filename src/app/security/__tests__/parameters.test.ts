import request from 'supertest';
import server, { db } from '../../../server';
import Parameters from '../../../data/models/security/Parameters.model';
import { Users } from '../../../data/models/security';
import { JwtAdapter } from '../../../utils';

describe('Parameters Integration Tests', () => {
    let authToken: string;
    let userId: string;

    beforeAll(async () => {
        await db.connect();


        const uniqueSuffix = Date.now().toString();
        const user = await Users.create({
            us_username: `param_tester_${uniqueSuffix}`,
            us_password_encriptado: 'hashed_password',
            us_nombre_completo: 'Param Tester',
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

    describe('GET /api/parameters', () => {
        it('should return 200 and a list of parameters', async () => {
            const response = await request(server)
                .get('/api/parameters')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('POST /api/parameters', () => {
        it('should return 201 and the created parameter', async () => {
            const paramKey = `IVA_${Date.now()}`;
            const paramValue = '15%';

            const response = await request(server)
                .post('/api/parameters')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    pa_clave: paramKey,
                    pa_valor: paramValue
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('pa_id');
            expect(response.body.pa_clave).toBe(paramKey);
            expect(response.body.pa_valor).toBe(paramValue);

            // Clean up
            await Parameters.destroy({ where: { pa_id: response.body.pa_id } });
        });

        it('should return 400 if validation fails', async () => {
            const response = await request(server)
                .post('/api/parameters')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    // Missing required fields
                    pa_clave: ''
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/parameters/:id', () => {
        it('should return 200 and the parameter if it exists', async () => {
            const param = await Parameters.create({
                pa_clave: `KEY_${Date.now()}`,
                pa_valor: 'VALUE'
            });

            const response = await request(server)
                .get(`/api/parameters/${param.pa_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.pa_id).toBe(param.pa_id);

            await param.destroy();
        });

        it('should return 404 if parameter does not exist', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000000';
            const response = await request(server)
                .get(`/api/parameters/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/parameters/:id', () => {
        it('should return 200 and the updated parameter', async () => {
            const param = await Parameters.create({
                pa_clave: `OLD_KEY_${Date.now()}`,
                pa_valor: 'OLD_VALUE'
            });

            const newValue = 'NEW_VALUE';
            const response = await request(server)
                .put(`/api/parameters/${param.pa_id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    pa_valor: newValue
                });

            expect(response.status).toBe(200);
            expect(response.body.pa_valor).toBe(newValue);

            // Verify db
            const refreshed = await Parameters.findByPk(param.pa_id);
            expect(refreshed?.pa_valor).toBe(newValue);

            await param.destroy();
        });
    });

    describe('DELETE /api/parameters/:id', () => {
        it('should return 200 and delete the parameter', async () => {
            const param = await Parameters.create({
                pa_clave: `DEL_KEY_${Date.now()}`,
                pa_valor: 'DEL_VALUE'
            });

            const response = await request(server)
                .delete(`/api/parameters/${param.pa_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);

            const deleted = await Parameters.findByPk(param.pa_id);
            expect(deleted).toBeNull();
        });
    });
});
