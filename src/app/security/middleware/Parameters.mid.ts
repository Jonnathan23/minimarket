import { Request, Response, NextFunction } from 'express';
import Parameters from '../../../data/models/security/Parameters.model';
import { AppError } from '../../../utils/AppError';

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
            throw new AppError('Parameter not found', 404);
        }
        req.parameter = parameter;
        next();
    } catch (error) {
        next(error);
    }
};
