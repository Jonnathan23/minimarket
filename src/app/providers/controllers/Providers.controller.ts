import { NextFunction, Request, Response } from 'express';
import Providers from '../../../data/models/providers/Providers.model';
import { AppError } from '../../../utils/AppError';

export class ProvidersController {

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const providers = await Providers.findAll();
            res.status(200).json(providers);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const provider = await Providers.create(req.body);
            res.status(201).json(provider);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const provider = req.provider!;
            await provider.update(req.body);
            res.status(200).json(provider);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const provider = req.provider!;
            await provider.destroy();
            res.status(200).json({ message: 'Provider deleted' });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(req.provider);
        } catch (error) {
            next(error);
        }
    }
}
