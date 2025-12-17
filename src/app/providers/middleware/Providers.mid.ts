import { Request, Response, NextFunction } from 'express';
import Providers from '../../../data/models/providers/Providers.model';

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
            return res.status(404).json({ error: 'Provider not found' });
        }
        req.provider = provider;
        next();
    } catch (error) {
        res.status(500).json({ errors: error });
    }
};
