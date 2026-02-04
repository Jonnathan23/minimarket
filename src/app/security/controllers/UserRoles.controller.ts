import { NextFunction, Request, Response } from 'express';
import UserRoles from '../../../data/models/security/UserRoles.model';
import { AppError } from '../../../utils/AppError';

export class UserRolesController {

    static async assignRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, roleId } = req.params;
            // Check if exists
            const existing = await UserRoles.findOne({ where: { ur_user_id: userId, ur_role_id: roleId } });
            if (existing) {
                throw new AppError('Role already assigned', 400);
            }

            const userRole = await UserRoles.create({ ur_user_id: userId, ur_role_id: roleId });
            res.status(201).json(userRole);
        } catch (error) {
            next(error);
        }
    }

    static async removeRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, roleId } = req.params;
            const deleted = await UserRoles.destroy({
                where: {
                    ur_user_id: userId,
                    ur_role_id: roleId
                }
            });

            if (deleted === 0) {
                throw new AppError('Assignment not found', 404);
            }

            res.status(200).json({ message: 'Role removed from user' });
        } catch (error) {
            next(error);
        }
    }

    static async listByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const roles = await UserRoles.findAll({ where: { ur_user_id: userId }, include: ['role'] });
            res.status(200).json(roles);
        } catch (error) {
            next(error);
        }
    }
}
