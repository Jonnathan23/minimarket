import request from 'supertest';
import server, { db } from '../../../server';
import Roles from '../../../data/models/security/Roles.model';
import { Users } from '../../../data/models/security';
import { JwtAdapter } from '../../../utils';
import UserRoles from '../../../data/models/security/UserRoles.model';

describe('UserRoles Integration Tests', () => {
    let authToken: string;
    let userId: string; // The user performing the action
    let targetUserId: string; // The user getting the role
    let roleId: string;

    beforeAll(async () => {

        await db.connect();

        const uniqueSuffix = Date.now().toString();

        // Admin user (who makes requests)
        const adminUser = await Users.create({
            us_username: `admin_${uniqueSuffix}`,
            us_password_encriptado: 'hashed_password',
            us_nombre_completo: 'Admin User',
            us_estado: true
        });
        userId = adminUser.us_id;
        authToken = (await JwtAdapter.generateToken({ id: userId }))!;

        // Target user
        const targetUser = await Users.create({
            us_username: `target_${uniqueSuffix}`,
            us_password_encriptado: 'hashed_password',
            us_nombre_completo: 'Target User',
            us_estado: true
        });
        targetUserId = targetUser.us_id;

        // Role
        const role = await Roles.create({
            ro_nombre_del_rol: `Role_${uniqueSuffix}`
        });
        roleId = role.ro_id;
    });

    afterAll(async () => {
        if (targetUserId) {
            // MAL: await UserRoles.destroy({ where: { us_id: targetUserId } });
            // BIEN:
            await UserRoles.destroy({ where: { ur_user_id: targetUserId } });

            await Users.destroy({ where: { us_id: targetUserId } }); // Este sí es us_id porque es la tabla Users
        }
        if (roleId) {
            await Roles.destroy({ where: { ro_id: roleId } });
        }
        if (userId) {
            await Users.destroy({ where: { us_id: userId } });
        }

        await db.disconnect();
    });

    describe('POST /api/user-roles/assign/:userId/:roleId', () => {
        it('should return 201 and assign the role', async () => {
            const response = await request(server)
                .post(`/api/user-roles/assign/${targetUserId}/${roleId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(201);
            expect(response.body.ur_user_id).toBe(targetUserId);
            expect(response.body.ur_role_id).toBe(roleId);
        });

        it('should return 400 if role is already assigned', async () => {
            // Already assigned in previous test (or ensure it's there)
            await request(server)
                .post(`/api/user-roles/assign/${targetUserId}/${roleId}`)
                .set('Authorization', `Bearer ${authToken}`);

            const response = await request(server)
                .post(`/api/user-roles/assign/${targetUserId}/${roleId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Role already assigned');
        });

        it('should return 500 if database fails', async () => {
            jest.spyOn(UserRoles, 'findOne').mockRejectedValueOnce(new Error('DB Error'));
            const response = await request(server)
                .post(`/api/user-roles/assign/${targetUserId}/${roleId}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('DELETE /api/user-roles/remove/:userId/:roleId', () => {
        it('should return 200 and remove the role', async () => {
            const existing = await UserRoles.findOne({
                where: { ur_user_id: targetUserId, ur_role_id: roleId }
            });

            if (!existing) {
                // MAL: us_id, ro_id
                // BIEN:
                await UserRoles.create({
                    ur_user_id: targetUserId,
                    ur_role_id: roleId
                });
            }

            const response = await request(server)
                .delete(`/api/user-roles/remove/${targetUserId}/${roleId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Role removed from user'); // Ojo: Ajusté el mensaje a lo que dice tu controller

            // Verify in DB that the role was removed
            const userRole = await UserRoles.findOne({
                where: {
                    // MAL: us_id, ro_id
                    // BIEN:
                    ur_user_id: targetUserId,
                    ur_role_id: roleId
                }
            });
            expect(userRole).toBeNull();
        });

        it('should return 404 if assignment not found', async () => {
            const fakeRoleId = '00000000-0000-0000-0000-000000000000';
            const response = await request(server)
                .delete(`/api/user-roles/remove/${targetUserId}/${fakeRoleId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Role not found');
        });

        it('should return 500 if database fails', async () => {
            jest.spyOn(UserRoles, 'destroy').mockRejectedValueOnce(new Error('DB Error'));
            const response = await request(server)
                .delete(`/api/user-roles/remove/${targetUserId}/${roleId}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/user-roles/list/:userId', () => {
        it('should return 200 and list the user roles', async () => {
            const existing = await UserRoles.findOne({
                where: { ur_user_id: targetUserId, ur_role_id: roleId }
            });

            if (!existing) {
                await UserRoles.create({
                    ur_user_id: targetUserId,
                    ur_role_id: roleId
                });
            }

            const response = await request(server)
                .get(`/api/user-roles/list/${targetUserId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);

            const roleIds = response.body.map((r: any) => r.ur_role_id);
            expect(roleIds).toContain(roleId);
        });

        it('should return 500 if database fails', async () => {
            jest.spyOn(UserRoles, 'findAll').mockRejectedValueOnce(new Error('DB Error'));
            const response = await request(server)
                .get(`/api/user-roles/list/${targetUserId}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('errors');
        });
    });
});
