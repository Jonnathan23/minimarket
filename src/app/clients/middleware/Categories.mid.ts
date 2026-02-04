import { Request, Response, NextFunction } from 'express';
import Categories from '../../../data/models/clients/Categories.model';
import { AppError } from '../../../utils/AppError';

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
            throw new AppError('Category not found', 404);
        }
        req.category = category;
        next();
    } catch (error) {
        next(error);
    }
};
