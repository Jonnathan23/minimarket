import { Request, Response, NextFunction } from 'express';
import InventoryMovements from '../../../data/models/logistics/InventoryMovements.model';

declare global {
    namespace Express {
        interface Request {
            inventoryMovement?: InventoryMovements;
        }
    }
}
