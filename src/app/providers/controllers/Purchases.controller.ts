import { NextFunction, Request, Response } from 'express';
import Purchases from '../../../data/models/providers/Purchases.model';
import PurchaseDetails from '../../../data/models/providers/PurchaseDetails.model';
import { AppError } from '../../../utils/AppError';

export class PurchasesController {

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const purchases = await Purchases.findAll({ include: ['purchase_details'] });
            res.status(200).json(purchases);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { providerId, productId } = req.params;
            const { pu_fecha, pu_total, details } = req.body;

            const purchase = await Purchases.create({
                pu_provider_id: providerId,
                pu_fecha,
                pu_total
            });

            if (details && Array.isArray(details)) {
                const detailsData = details.map((detail: any) => ({
                    ...detail,
                    pd_purchase_id: purchase.pu_id,
                    pd_product_id: productId
                }));
                await PurchaseDetails.bulkCreate(detailsData);
            }

            res.status(201).json(purchase);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(req.purchase);
        } catch (error) {
            next(error);
        }
    }
}
