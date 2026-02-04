import { NextFunction, Request, Response } from 'express';
import Sales from '../../../data/models/sales/Sales.model';
import SaleDetails from '../../../data/models/sales/SaleDetails.model';
import Products from '../../../data/models/clients/Products.model';
import InventoryMovements from '../../../data/models/logistics/InventoryMovements.model';
import { AppError } from '../../../utils/AppError';

export class SalesController {

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const sales = await Sales.findAll({ include: ['sale_details'] });
            res.status(200).json(sales);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { clientId, productId } = req.params;
            const { sa_fecha, sa_total, sa_medio_de_pago, details } = req.body;

            const sa_user_id = req.user?.us_id;

            if (!sa_user_id) {
                throw new AppError('User not authenticated', 401);
            }

            // Create Sale Header
            const sale = await Sales.create({
                sa_client_id: clientId || null,
                sa_user_id: sa_user_id,
                sa_fecha,
                sa_total,
                sa_medio_de_pago
            });

            // Process Details
            if (details && Array.isArray(details)) {
                for (const detail of details) {
                    const { sd_cantidad, sd_precio_unitario } = detail;

                    // Create Detail
                    await SaleDetails.create({
                        sd_sale_id: sale.sa_id,
                        sd_product_id: productId,
                        sd_cantidad,
                        sd_precio_unitario
                    });

                    // Update Product Stock
                    const product = await Products.findByPk(productId);
                    if (product) {
                        await product.decrement('pr_stock', { by: sd_cantidad });
                    }

                    // Create Inventory Movement (SALIDA)
                    await InventoryMovements.create({
                        im_product_id: productId,
                        im_tipo: 'SALIDA',
                        im_cantidad: sd_cantidad,
                        im_referencia: `Venta ${sale.sa_id}`
                    });
                }
            }

            res.status(201).json(sale);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(req.sale);
        } catch (error) {
            next(error);
        }
    }
}
