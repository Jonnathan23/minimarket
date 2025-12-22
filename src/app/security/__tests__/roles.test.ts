import request from 'supertest';
import server from '../../../server';
import Roles from '../../../data/models/security/Roles.model';
import { Users } from '../../../data/models/security';
import { JwtAdapter } from '../../../utils';

describe('Roles Integration Tests', () => {
    let authToken: string;
    let userId: string;

    beforeAll(async () => {
        // Create a user for authentication
        const uniqueSuffix = Date.now().toString();
        const user = await Users.create({
            us_username: `testuser_${uniqueSuffix}`,
            us_password_encriptado: 'hashed_password',
            us_nombre_completo: 'Test User',
            us_estado: true
        });
        userId = user.us_id;
        authToken = (await JwtAdapter.generateToken({ id: userId }))!;
    });

    afterAll(async () => {
        // Clean up the user
        if (userId) {
            await Users.destroy({ where: { us_id: userId } });
        }
    });

    describe('GET /api/roles', () => {
        it('should return 200 and a list of roles', async () => {
            const response = await request(server)
                .get('/api/roles')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('POST /api/roles', () => {
        it('should return 201 and the created role', async () => {
            const roleName = `Role_${Date.now()}`;
            const response = await request(server)
                .post('/api/roles')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    ro_nombre_del_rol: roleName
                });

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('ro_id');
            expect(response.body.data.ro_nombre_del_rol).toBe(roleName);

            // Clean up
            await Roles.destroy({ where: { ro_id: response.body.data.ro_id } });
        });

        it('should return 400 if validation fails', async () => {
            const response = await request(server)
                .post('/api/roles')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    // Missing ro_nombre_del_rol
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/roles/:id', () => {
        it('should return 200 and the role if it exists', async () => {
            // Create role directly
            const role = await Roles.create({
                ro_nombre_del_rol: `RoleToGet_${Date.now()}`
            });

            const response = await request(server)
                .get(`/api/roles/${role.ro_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.ro_id).toBe(role.ro_id);
            expect(response.body.ro_nombre_del_rol).toBe(role.ro_nombre_del_rol);

            // Clean up
            await role.destroy();
        });

        it('should return 404 if role does not exist', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000000';
            const response = await request(server)
                .get(`/api/roles/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('PUT /api/roles/:id', () => {
        it('should return 200 and the updated role', async () => {
            const role = await Roles.create({
                ro_nombre_del_rol: `RoleToUpdate_${Date.now()}`
            });

            const updatedName = `UpdatedRole_${Date.now()}`;

            const response = await request(server)
                .put(`/api/roles/${role.ro_id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    ro_nombre_del_rol: updatedName
                });

            expect(response.status).toBe(200);
            expect(response.body.ro_nombre_del_rol).toBe(updatedName);

            // Verify db
            const refreshedRole = await Roles.findByPk(role.ro_id);
            expect(refreshedRole?.ro_nombre_del_rol).toBe(updatedName);

            await role.destroy();
        });
    });

    describe('DELETE /api/roles/:id', () => {
        it('should return 200 and delete the role', async () => {
            const role = await Roles.create({
                ro_nombre_del_rol: `RoleToDelete_${Date.now()}`
            });

            const response = await request(server)
                .delete(`/api/roles/${role.ro_id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Role deleted');

            // Verify db
            const deletedRole = await Roles.findByPk(role.ro_id);
            expect(deletedRole).toBeNull();
        });
    });
});
