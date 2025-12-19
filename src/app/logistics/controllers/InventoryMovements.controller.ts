import { Request, Response } from "express";
import InventoryMovements from '../../../data/models/logistics/InventoryMovements.model';
import Products from '../../../data/models/clients/Products.model';

export class InventoryMovementsController {

static getAll = async (req: Request, res: Response) => {
        try {
            const movements = await InventoryMovements.findAll();
            res.json(movements);
        } catch (error) {
            res.status(500).json({ errors: error })
        }
    }

} 