import request from 'supertest';
import server from '../../../server';
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
            await UserRoles.destroy({ where: { us_id: targetUserId } });
            await Users.destroy({ where: { us_id: targetUserId } });
        }
        if (roleId) {
            await Roles.destroy({ where: { ro_id: roleId } });
        }
        if (userId) {
            await Users.destroy({ where: { us_id: userId } });
        }
    });

    describe('POST /api/user-roles/user-roles/assign/:userId/:roleId', () => {
        it('should return 201 and assign the role', async () => {
            const response = await request(server)
                .post(`/api/user-roles/user-roles/assign/${targetUserId}/${roleId}`)
                .set('Authorization', `Bearer ${authToken}`);

            // ...
        });
    });

    describe('GET /api/user-roles/user-roles/list/:userId', () => {
        it('should return 200 and list the user roles', async () => {
            // Assign role first to ensure there is something to list
            await UserRoles.create({
                us_id: targetUserId,
                ro_id: roleId
            });

            const response = await request(server)
                .get(`/api/user-roles/user-roles/list/${targetUserId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            const roles = response.body.map((r: any) => r.ro_id);
            expect(roles).toContain(roleId);
        });
    });

    describe('DELETE /api/user-roles/user-roles/remove/:userId/:roleId', () => {
        it('should return 200 and remove the role', async () => {
            // Ensure role is assigned before deleting
            const existing = await UserRoles.findOne({ where: { us_id: targetUserId, ro_id: roleId } });
            if (!existing) {
                await UserRoles.create({
                    us_id: targetUserId,
                    ro_id: roleId
                });
            }

            const response = await request(server)
                .delete(`/api/user-roles/user-roles/remove/${targetUserId}/${roleId}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Role removed successfully');

            // Verify in DB
            const userRole = await UserRoles.findOne({
                where: {
                    us_id: targetUserId,
                    ro_id: roleId
                }
            });
            expect(userRole).toBeNull();
        });
    });
});
