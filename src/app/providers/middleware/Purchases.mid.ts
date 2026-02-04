import { Request, Response, NextFunction } from 'express';
import Purchases from '../../../data/models/providers/Purchases.model';
import { AppError } from '../../../utils/AppError';

declare global {
    namespace Express {
        interface Request {
            purchase?: Purchases;
        }
    }
}



export const purchaseExists = async (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
        const purchase = await Purchases.findByPk(id, { include: ['purchase_details'] });
        if (!purchase) {
            throw new AppError('Purchase not found', 404);
        }
        req.purchase = purchase;
        next();
    } catch (error) {
        next(error);
    }
};
