import { Request, Response, NextFunction } from 'express';
import Products from '../../../data/models/clients/Products.model';
import { AppError } from '../../../utils/AppError';

declare global {
    namespace Express {
        interface Request {
            product?: Products;
        }
    }
}



export const productExists = async (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
        const product = await Products.findByPk(id);
        if (!product) {
            throw new AppError('Product not found', 404);
        }
        req.product = product;
        next();
    } catch (error) {
        next(error);
    }
};
