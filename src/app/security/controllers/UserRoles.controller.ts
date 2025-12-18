import { Request, Response } from 'express';
import UserRoles from '../../../data/models/security/UserRoles.model';

export class UserRolesController {

    static async assignRole(req: Request, res: Response) {
        try {
            const { userId, roleId } = req.params;
            // Check if exists
            const existing = await UserRoles.findOne({ where: { ur_user_id: userId, ur_role_id: roleId } });
            if (existing) {
                return res.status(400).json({ error: 'Role already assigned' });
            }

            const userRole = await UserRoles.create({ ur_user_id: userId, ur_role_id: roleId });
            res.status(201).json(userRole);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async removeRole(req: Request, res: Response) {
        try {
            const { userId, roleId } = req.params;
            const deleted = await UserRoles.destroy({
                where: {
                    ur_user_id: userId,
                    ur_role_id: roleId
                }
            });

            if (deleted === 0) {
                return res.status(404).json({ error: 'Assignment not found' });
            }

            res.json({ message: 'Role removed from user' });
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async listByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const roles = await UserRoles.findAll({ where: { ur_user_id: userId }, include: ['role'] });
            res.json(roles);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }
}
