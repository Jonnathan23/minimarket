import { Request, Response, NextFunction } from 'express';
import CashMovements from '../../../data/models/logistics/CashMovements.model';

declare global {
    namespace Express {
        interface Request {
            cashMovement?: CashMovements;
        }
    }
}