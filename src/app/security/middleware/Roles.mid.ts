import { Request, Response, NextFunction } from 'express';
import Roles from '../../../data/models/security/Roles.model';

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
            return res.status(404).json({ error: 'Role not found' });
        }
        req.role = role;
        next();
    } catch (error) {
        res.status(500).json({ errors: error });
    }
};
