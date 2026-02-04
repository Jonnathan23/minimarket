import { Request, Response, NextFunction } from 'express';
import Clients from '../../../data/models/clients/Clients.model';
import { AppError } from '../../../utils/AppError';

declare global {
    namespace Express {
        interface Request {
            client?: Clients;
        }
    }
}



export const clientExists = async (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
        const client = await Clients.findByPk(id);
        if (!client) {
            throw new AppError('Client not found', 404);
        }
        req.client = client;
        next();
    } catch (error) {
        next(error);
    }
};
