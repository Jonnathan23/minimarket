import { Request, Response } from 'express';
import Parameters from '../../../data/models/security/Parameters.model';

export class ParametersController {

    static async getAll(req: Request, res: Response) {
        try {
            const parameters = await Parameters.findAll();
            res.status(200).json(parameters);
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
            res.status(200).json(parameter);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const parameter = req.parameter!;
            await parameter.destroy();
            res.status(200).json({ message: 'Parameter deleted' });
        } catch (error) {
            res.status(500).json({ errors: error });
            return;
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            res.status(200).json(req.parameter);
        } catch (error) {
            res.status(500).json({ errors: error });
            return;
        }
    }
}
