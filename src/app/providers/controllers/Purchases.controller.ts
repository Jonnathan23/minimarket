import { Request, Response } from 'express';
import Purchases from '../../../data/models/providers/Purchases.model';
import PurchaseDetails from '../../../data/models/providers/PurchaseDetails.model';

export class PurchasesController {

    static async getAll(req: Request, res: Response) {
        try {
            const purchases = await Purchases.findAll({ include: ['purchase_details'] });
            res.json(purchases);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async create(req: Request, res: Response) {
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
            res.status(500).json({ errors: error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            res.json(req.purchase);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }
}
