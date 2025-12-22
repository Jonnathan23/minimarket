import { Request, Response } from 'express';
import CashMovements from '../../../data/models/logistics/CashMovements.model';

export class CashMovementsController {

    static async getAll(req: Request, res: Response) {
        try {
            const movements = await CashMovements.findAll();
            res.status(200).json(movements);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { cm_fecha, cm_tipo, cm_monto } = req.body;
            // Link to authenticated user (RF)
            const cm_user_id = req.user?.us_id;

            if (!cm_user_id) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            const movement = await CashMovements.create({
                cm_user_id,
                cm_fecha,
                cm_tipo,
                cm_monto
            });
            res.status(201).json(movement);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            res.status(200).json(req.cashMovement);
        } catch (error) {
            res.status(500).json({ errors: error });
            console.log(error)
        }
    }
}
