import { Request, Response } from 'express';
import Categories from '../../../data/models/clients/Categories.model';

export class CategoriesController {

    static async getAll(req: Request, res: Response) {
        try {
            const categories = await Categories.findAll();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({ errors: error });
            console.log(error)
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const category = await Categories.create(req.body);
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const category = req.category!;
            await category.update(req.body);
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const category = req.category!;
            await category.destroy();
            res.status(200).json({ message: 'Category deleted' });
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            res.status(200).json(req.category);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }
}
