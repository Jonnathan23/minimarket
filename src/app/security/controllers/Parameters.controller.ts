import { Request, Response } from 'express';
import Parameters from '../../../data/models/security/Parameters.model';

export class ParametersController {

    static async getAll(req: Request, res: Response) {
        try {
            const parameters = await Parameters.findAll();
            res.json(parameters);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const parameter = await Parameters.create(req.body);
            res.status(201).json(parameter);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const parameter = req.parameter!;
            await parameter.update(req.body);
            res.json(parameter);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const parameter = req.parameter!;
            await parameter.destroy();
            res.json({ message: 'Parameter deleted' });
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            res.json(req.parameter);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }
}
