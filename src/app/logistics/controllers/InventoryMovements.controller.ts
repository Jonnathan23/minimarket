import { Request, Response } from "express";
import InventoryMovements from '../../../data/models/logistics/InventoryMovements.model';
import Products from '../../../data/models/clients/Products.model';

export class InventoryMovementsController {

    static getAll = async (req: Request, res: Response) => {
        try {
            const movements = await InventoryMovements.findAll();
            res.status(200).json(movements);
        } catch (error) {
            res.status(500).json({ errors: error })
        }
    }

    static create = async (req: Request, res: Response) => {
        try {
            const { productId } = req.params;
            const { im_tipo, im_cantidad, im_referencia } = req.body;

            // Create Movement
            const movement = await InventoryMovements.create({
                im_product_id: productId,
                im_tipo,
                im_cantidad,
                im_referencia
            });

            // Update Product Stock
            const product = await Products.findByPk(productId);
            if (product) {
                if (im_tipo === 'ENTRADA') {
                    await product.increment('pr_stock', { by: im_cantidad });
                } else if (im_tipo === 'SALIDA') {
                    await product.decrement('pr_stock', { by: im_cantidad });
                }
            }

            res.status(201).json(movement);
        } catch (error: any) {
            res.status(500).json({ errors: error.message || error });
        }
    }
}