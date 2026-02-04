import { Request, Response, NextFunction } from 'express';
import Roles from '../../../data/models/security/Roles.model';
import { AppError } from '../../../utils/AppError';

declare global {
    namespace Express {
        interface Request {
            role?: Roles;
        }
    }
}



export const validateRoleExists = async (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
        const role = await Roles.findByPk(id);
        if (!role) {
            throw new AppError('Role not found', 404);
        }
        req.role = role;
        next();
    } catch (error) {
        next(error);
    }
};
