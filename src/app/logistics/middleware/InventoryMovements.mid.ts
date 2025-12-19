import { Request, Response, NextFunction } from 'express';
import InventoryMovements from '../../../data/models/logistics/InventoryMovements.model';

declare global {
    namespace Express {
        interface Request {
            inventoryMovement?: InventoryMovements;
        }
    }
}

export const inventoryMovementExists = async (req: Request, res: Response, next: NextFunction, id: string) => {
    try {
        const movement = await InventoryMovements.findByPk(id);
        if (!movement) {
            return res.status(404).json({ error: 'Inventory Movement not found' });
        }
        req.inventoryMovement = movement;
        next();
    } catch (error) {
        res.status(500).json({ errors: error });
    }
};