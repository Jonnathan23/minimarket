import { Request, Response, NextFunction } from 'express';
import Parameters from '../../../data/models/security/Parameters.model';

declare global {
    namespace Express {
        interface Request {
            parameter?: Parameters;
        }
    }
}

export const parameterExists = async (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
        const parameter = await Parameters.findByPk(id);
        if (!parameter) {
            return res.status(404).json({ error: 'Parameter not found' });
        }
        req.parameter = parameter;
        next();
    } catch (error) {
        res.status(500).json({ errors: error });
    }
};
