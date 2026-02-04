import { Request, Response, NextFunction } from 'express';
import Sales from '../../../data/models/sales/Sales.model';
import { AppError } from '../../../utils/AppError';

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
            throw new AppError('Sale not found', 404);
        }
        req.sale = sale;
        next();
    } catch (error) {
        next(error);
    }
};