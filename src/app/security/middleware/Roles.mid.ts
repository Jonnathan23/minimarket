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



export const validateRoleExists = async (req: Request, res: Response, next: NextFunction) => {
    try {        
        const { ro_id } = req.params;

        const role = await Roles.findByPk(ro_id);

        if (!role) {
            throw new AppError('Role not found', 404);
        }

        // Inyectamos el rol en la request para que el controller lo use
        req.role = role;
        
        next();
    } catch (error) {
        next(error);
    }
};