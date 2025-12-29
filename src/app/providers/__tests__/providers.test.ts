import request from 'supertest';
import server, { db } from '../../../server';
import Providers from '../../../data/models/providers/Providers.model';
import { Users } from '../../../data/models/security';
import { JwtAdapter } from '../../../utils';

describe('Providers Integration Tests', () => {
    let authToken: string;
    let userId: string;

    beforeAll(async () => {
        await db.connect();
        const uniqueSuffix = Date.now().toString();
        const user = await Users.create({
            us_username: `prov_tester_${uniqueSuffix}`,
            us_password_encriptado: 'hashed_password',
            us_nombre_completo: 'Provider Tester',
            us_estado: true
        });
        userId = user.us_id;
        authToken = (await JwtAdapter.generateToken({ id: userId }))!;
    });

    afterAll(async () => {
        try {
            // Limpieza proactiva de proveedores para no dejar basura
            await Providers.destroy({ where: {} });
            if (userId) {
                await Users.destroy({ where: { us_id: userId } });
            }
        } catch (error) {
            console.error("Error en afterAll Cleanup:", error);
        } finally {
            await db.disconnect();
        }
    });

    describe('GET /api/providers', () => {
        it('should return 200 and a list of providers', async () => {
            const response = await request(server)
                .get('/api/providers')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return 500 if database fails', async () => {
            jest.spyOn(Providers, 'findAll').mockRejectedValueOnce(new Error('DB Error'));
            const response = await request(server)
                .get('/api/providers')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('POST /api/providers/provider', () => {
        it('should return 201 and the created provider', async () => {
            const unique = Date.now();
            const response = await request(server)
                .post('/api/providers/provider')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    po_nombre: `Prov_${unique}`,
                    po_RUC_NIT: `RUC${unique}`,
                    po_direccion: 'Address 123',
                    po_telefono: '0990000000',
                    po_correo: `prov_${unique}@test.com`
                });

            expect(response.status).toBe(201);
            expect(response.body.po_nombre).toBe(`Prov_${unique}`);

            await Providers.destroy({ where: { po_id: response.body.po_id } });
        });

        it('should return 400 if validation fails', async () => {
            const response = await request(server)
                .post('/api/providers/provider')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    // Missing fields
                    po_nombre: ''
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });

        it('should return 500 if database fails', async () => {
            jest.spyOn(Providers, 'create').mockRejectedValueOnce(new Error('DB Error'));
            const response = await request(server)
                .post('/api/providers/provider')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    po_nombre: 'ErrProv',
                    po_RUC_NIT: '123123',
                    po_direccion: 'Addr',
                    po_telefono: '123',
                    po_correo: 'e@e.com'
                });
            expect(response.status).toBe(500);
        });
    });

    describe('GET /api/providers/:id', () => {
        it('should return 200 and the provider', async () => {
            const unique = Date.now();
            // CORRECCIÓN: 'as any' para que TS ignore que falta po_id
            const prov = await Providers.create({
                po_nombre: `GetProv_${unique}`,
                po_RUC_NIT: `RUC${unique}`,
                po_direccion: 'Addr',
                po_telefono: '123',
                po_correo: `get_${unique}@test.com`
            } as any);

            const response = await request(server)
                .get(`/api/providers/${prov.po_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.po_id).toBe(prov.po_id);

            await prov.destroy();
        });

        it('should return 404 if provider not found', async () => {
            const response = await request(server)
                .get(`/api/providers/00000000-0000-0000-0000-000000000000`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/providers/:id', () => {
        it('should return 200 and update provider', async () => {
            const unique = Date.now();
            const prov = await Providers.create({
                po_nombre: `OldProv_${unique}`,
                po_RUC_NIT: `RUC${unique}`,
                po_direccion: 'Addr',
                po_telefono: '123',
                po_correo: `old_${unique}@test.com`
            } as any);

            const newName = `NewProv_${unique}`;
            const response = await request(server)
                .put(`/api/providers/${prov.po_id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ po_nombre: newName });

            expect(response.status).toBe(200);
            expect(response.body.po_nombre).toBe(newName);

            await prov.destroy();
        });

        it('should return 500 if update fails', async () => {
            const prov = await Providers.create({
                po_nombre: `ErrProv_${Date.now()}`,
                po_RUC_NIT: '123',
                po_direccion: 'Addr',
                po_telefono: '123',
                po_correo: 'err@test.com'
            } as any);

            const spy = jest.spyOn(Providers.prototype, 'update').mockRejectedValueOnce(new Error('Update Error'));

            const response = await request(server)
                .put(`/api/providers/${prov.po_id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ po_nombre: 'Fail' });

            expect(response.status).toBe(500);
            spy.mockRestore();
            await prov.destroy();
        });
    });

    describe('DELETE /api/providers/:id', () => {
        it('should return 200 and delete provider', async () => {
            const unique = Date.now();
            const prov = await Providers.create({
                po_nombre: `DelProv_${unique}`,
                po_RUC_NIT: `RUC${unique}`,
                po_direccion: 'Addr',
                po_telefono: '123',
                po_correo: `del_${unique}@test.com`
            } as any);

            const response = await request(server)
                .delete(`/api/providers/${prov.po_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            const deleted = await Providers.findByPk(prov.po_id);
            expect(deleted).toBeNull();
        });

        it('should return 500 if delete fails', async () => {
            const prov = await Providers.create({
                po_nombre: `DelErr_${Date.now()}`,
                po_RUC_NIT: '123',
                po_direccion: 'Addr',
                po_telefono: '123',
                po_correo: 'delerr@test.com'
            } as any);
            
            const spy = jest.spyOn(Providers.prototype, 'destroy').mockRejectedValueOnce(new Error('Delete Error'));

            const response = await request(server)
                .delete(`/api/providers/${prov.po_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(500);
            spy.mockRestore();
            await prov.destroy();
        });
    });
});
