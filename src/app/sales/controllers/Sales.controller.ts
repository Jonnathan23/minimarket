import { Request, Response } from 'express';
import Sales from '../../../data/models/sales/Sales.model';
import SaleDetails from '../../../data/models/sales/SaleDetails.model';
import Products from '../../../data/models/clients/Products.model';
import InventoryMovements from '../../../data/models/logistics/InventoryMovements.model';

export class SalesController {

    static async getAll(req: Request, res: Response) {
        try {
            const sales = await Sales.findAll({ include: ['sale_details'] });
            res.json(sales);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { clientId, productId } = req.params;
            const { sa_fecha, sa_total, sa_medio_de_pago, details } = req.body;

            const sa_user_id = req.user?.us_id;

            if (!sa_user_id) {
                return res.status(401).json({ error: 'User not authenticated' });
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
        } catch (error: any) {
            res.status(500).json({ errors: error.message || error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            res.json(req.sale);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }
}
