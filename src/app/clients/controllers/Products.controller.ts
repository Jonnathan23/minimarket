import { Request, Response } from 'express';
import Products from '../../../data/models/clients/Products.model';

export class ProductsController {

    static async getAll(req: Request, res: Response) {
        try {
            // RF-01: List maximum 3 results ordered by ID descending
            const products = await Products.findAll({
                limit: 3,
                order: [['pr_id', 'DESC']]
            });
            res.json(products);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { categoryId } = req.params;
            const { pr_name, pr_price, pr_availability } = req.body;

            const product = await Products.create({
                pr_name,
                pr_price,
                pr_availability,
                pr_category_id: categoryId
            });
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const product = req.product!;
            await product.update(req.body);
            res.json(product);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const product = req.product!;
            await product.destroy();
            res.json({ message: 'Product deleted' });
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            res.json(req.product);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }
}
