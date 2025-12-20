import { Request, Response, NextFunction } from 'express';
import Clients from '../../../data/models/clients/Clients.model';

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
            return res.status(404).json({ error: 'Client not found' });
        }
        req.client = client;
        next();
    } catch (error) {
        res.status(500).json({ errors: error });
    }
};
