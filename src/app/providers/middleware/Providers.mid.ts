import { Request, Response, NextFunction } from 'express';
import Providers from '../../../data/models/providers/Providers.model';
import { AppError } from '../../../utils/AppError';

declare global {
    namespace Express {
        interface Request {
            provider?: Providers;
        }
    }
}



export const providerExists = async (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
        const provider = await Providers.findByPk(id);
        if (!provider) {
            throw new AppError('Provider not found', 404);
        }
        req.provider = provider;
        next();
    } catch (error) {
        next(error);
    }
};
