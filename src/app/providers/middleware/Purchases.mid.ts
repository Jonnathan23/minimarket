import { Request, Response, NextFunction } from 'express';
import Purchases from '../../../data/models/providers/Purchases.model';

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
            return res.status(404).json({ error: 'Purchase not found' });
        }
        req.purchase = purchase;
        next();
    } catch (error) {
        res.status(500).json({ errors: error });
    }
};
