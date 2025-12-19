import { Request, Response } from 'express';
import CashMovements from '../../../data/models/logistics/CashMovements.model';

export class CashMovementsController {

  static async getAll(req: Request, res: Response) {
        try {
            const movements = await CashMovements.findAll();
            res.json(movements);
        } catch (error) {
            res.status(500).json({ errors: error });
        }
    }

}