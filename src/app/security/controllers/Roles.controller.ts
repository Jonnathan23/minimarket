import { Request, Response } from 'express';
import Roles from '../../../data/models/security/Roles.model';

export class RolesController {

    static async getAll(req: Request, res: Response) {
        try {
            const roles = await Roles.findAll();
            res.status(200).json(roles);
        } catch (error) {
            res.status(500).json({ errors: error });
            return;
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const role = await Roles.create(req.body);
            res.status(201).json({ data: role });
        } catch (error) {
            res.status(500).json({ errors: error });
            return;
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const role = req.role!;
            await role.update(req.body);
            res.status(200).json(role);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const role = req.role!;
            await role.destroy();
            res.status(200).json({ message: 'Role deleted' });
        } catch (error) {
            res.status(500).json({ errors: error });
            return;
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            res.status(200).json(req.role);
        } catch (error) {
            res.status(500).json({ errors: error });
            return;
        }
    }
}
