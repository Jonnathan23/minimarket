import { NextFunction, Request, Response } from 'express';
import Categories from '../../../data/models/clients/Categories.model';
import { AppError } from '../../../utils/AppError';

export class CategoriesController {

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await Categories.findAll();
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await Categories.create(req.body);
            res.status(201).json(category);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const category = req.category!;
            await category.update(req.body);
            res.status(200).json(category);
        } catch (error) {
            next(error);
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const category = req.category!;
            await category.destroy();
            res.status(200).json({ message: 'Category deleted' });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(req.category);
        } catch (error) {
            next(error);
        }
    }
}
