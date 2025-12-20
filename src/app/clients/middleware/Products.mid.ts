import { Request, Response, NextFunction } from 'express';
import Products from '../../../data/models/clients/Products.model';

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
            return res.status(404).json({ error: 'Product not found' });
        }
        req.product = product;
        next();
    } catch (error) {
        res.status(500).json({ errors: error });
    }
};
