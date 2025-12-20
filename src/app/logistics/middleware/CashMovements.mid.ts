import { Request, Response, NextFunction } from 'express';
import CashMovements from '../../../data/models/logistics/CashMovements.model';

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
            return res.status(404).json({ error: 'Cash Movement not found' });
        }
        req.cashMovement = movement;
        next();
    } catch (error) {
        res.status(500).json({ errors: error });
    }
};