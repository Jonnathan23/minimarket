import { NextFunction, Request, Response } from 'express';
import Roles from '../../../data/models/security/Roles.model';
import { AppError } from '../../../utils/AppError';

export class RolesController {

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const roles = await Roles.findAll();
            res.status(200).json(roles);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const role = await Roles.create(req.body);
            res.status(201).json({ data: role });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const role = req.role!;
            await role.update(req.body);
            res.status(200).json(role);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const role = req.role!;
            await role.destroy();
            res.status(200).json({ message: 'Role deleted' });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(req.role);
        } catch (error) {
            next(error);
        }
    }
}
