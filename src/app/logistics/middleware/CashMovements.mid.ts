import { Request, Response, NextFunction } from 'express';
import CashMovements from '../../../data/models/logistics/CashMovements.model';
import { AppError } from '../../../utils/AppError';

declare global {
    namespace Express {
        interface Request {
            cashMovement?: CashMovements;
        }
    }
}



export const cashMovementExists = async (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
        const movement = await CashMovements.findByPk(id);
        if (!movement) {
            throw new AppError('Cash Movement not found', 404);
        }
        req.cashMovement = movement;
        next();
    } catch (error) {
        next(error);
    }
};