import { Request, Response, NextFunction } from 'express';
import InventoryMovements from '../../../data/models/logistics/InventoryMovements.model';
import { AppError } from '../../../utils/AppError';

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
            throw new AppError('Inventory Movement not found', 404);
        }
        req.inventoryMovement = movement;
        next();
    } catch (error) {
        next(error);
    }
};