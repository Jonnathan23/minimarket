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
            // 1. Extraemos todo desde el body, ya no usamos req.params
            const {
                sa_client_name,
                sa_client_ci,
                sa_fecha,
                sa_total,
                sa_medio_de_pago,
                details
            } = req.body;

            const sa_user_id = req.user?.us_id;

            if (!sa_user_id) {
                throw new AppError('User not authenticated', 401);
            }

            // 2. Crear la Cabecera (Sale) guardando los datos directos del cliente
            const sale = await Sales.create({
                sa_client_name,
                sa_client_ci,
                sa_user_id: sa_user_id,
                sa_fecha,
                sa_total,
                sa_medio_de_pago
            });

            // 3. Procesar los Detalles (Esto se queda exactamente igual)
            if (details && Array.isArray(details)) {
                for (const detail of details) {
                    const { sd_product_id, sd_cantidad, sd_precio_unitario } = detail;

                    const product = await Products.findByPk(sd_product_id);
                    if (!product) {
                        throw new AppError(`Product ${sd_product_id} not found`, 404);
                    }

                    await SaleDetails.create({
                        sd_sale_id: sale.sa_id,
                        sd_product_id: sd_product_id,
                        sd_cantidad,
                        sd_precio_unitario
                    });

                    await product.decrement('pr_stock', { by: sd_cantidad });

                    await InventoryMovements.create({
                        im_product_id: sd_product_id,
                        im_tipo: 'SALIDA',
                        im_cantidad: sd_cantidad,
                        im_referencia: `Venta #${sale.sa_id}`
                    });
                }
            }

            res.status(201).json({ message: 'Venta creada exitosamente' });
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
