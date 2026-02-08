import { NextFunction, Request, Response } from 'express';
import Products from '../../../data/models/clients/Products.model';
import { AppError } from '../../../utils/AppError';

export class ProductsController {

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            // RF-01: List maximum 3 results ordered by ID descending
            const products = await Products.findAll({
                limit: 10,
                order: [['pr_category_id', 'DESC'], ['pr_name', 'ASC']]
            });
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { categoryId } = req.params;
            const { pr_name, pr_price, pr_availability, pr_stock } = req.body;

            const product = await Products.create({
                pr_name,
                pr_price,
                pr_availability,
                pr_category_id: categoryId,
                pr_stock
            });
            res.status(201).json({ message: 'Product created successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const product = req.product!;
            const category = req.category!;
            const newData = {
                ...req.body,
                pr_category_id: category.ca_id
            }

            await product.update(newData);
            res.status(200).json({ message: 'Product updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    static updateStock = async (req: Request, res: Response) => {
        try {
            const productUpdate = req.product!;
            const incomingStock = req.body.pr_stock;
            const finalStock = incomingStock >= 0 ? incomingStock : 0;

            await productUpdate.update({
                pr_stock: finalStock,
                pr_availability: finalStock > 0
            });

            res.status(200).json({ message: 'Stock updated successfully' });
        } catch (error) {
            res.status(500).json({ errors: error })
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const product = req.product!;
            await product.destroy();
            res.status(200).json({ message: 'Product deleted' });
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(req.product);
        } catch (error) {
            next(error);
        }
    }
}
