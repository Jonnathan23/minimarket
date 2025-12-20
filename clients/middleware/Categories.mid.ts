import { Request, Response, NextFunction } from 'express';
import Categories from '../../../data/models/clients/Categories.model';

declare global {
    namespace Express {
        interface Request {
            category?: Categories;
        }
    }
}

export const categoryExists = async (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
        const category = await Categories.findByPk(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        req.category = category;
        next();
    } catch (error) {
        res.status(500).json({ errors: error });
    }
};
