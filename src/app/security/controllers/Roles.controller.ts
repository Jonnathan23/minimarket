import { Request, Response } from 'express';
import Roles from '../../../data/models/security/Roles.model';

export class RolesController {

    static async getAll(req: Request, res: Response) {
        try {
            const roles = await Roles.findAll();
            res.json(roles);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const role = await Roles.create(req.body);
            res.status(201).json(role);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const role = req.role!;
            await role.update(req.body);
            res.json(role);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const role = req.role!;
            await role.destroy();
            res.json({ message: 'Role deleted' });
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            res.json(req.role);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }
}
