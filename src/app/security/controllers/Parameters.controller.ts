import { NextFunction, Request, Response } from 'express';
import Parameters from '../../../data/models/security/Parameters.model';
import { AppError } from '../../../utils/AppError';

export class ParametersController {

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const parameters = await Parameters.findAll();
            res.status(200).json(parameters);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const parameter = await Parameters.create(req.body);
            res.status(201).json(parameter);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const parameter = req.parameter!;
            await parameter.update(req.body);
            res.status(200).json(parameter);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const parameter = req.parameter!;
            await parameter.destroy();
            res.status(200).json({ message: 'Parameter deleted' });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(req.parameter);
        } catch (error) {
            next(error);
        }
    }
}
