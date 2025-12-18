import { Request, Response, NextFunction } from 'express';
import Sales from '../../../data/models/sales/Sales.model';

declare global {
    namespace Express {
        interface Request {
            sale?: Sales;
        }
    }
}

export const saleExists = async (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
        const sale = await Sales.findByPk(id, { include: ['sale_details'] });
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        req.sale = sale;
        next();
    } catch (error) {
        res.status(500).json({ errors: error });
    }
};
