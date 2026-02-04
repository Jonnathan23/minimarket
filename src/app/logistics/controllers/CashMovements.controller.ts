import { NextFunction, Request, Response } from 'express';
import CashMovements from '../../../data/models/logistics/CashMovements.model';
import { AppError } from '../../../utils/AppError';

export class CashMovementsController {

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const movements = await CashMovements.findAll();
            res.status(200).json(movements);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { cm_fecha, cm_tipo, cm_monto } = req.body;
            // Link to authenticated user (RF)
            const cm_user_id = req.user?.us_id;

            if (!cm_user_id) {
                throw new AppError('User not authenticated', 401);
            }

            const movement = await CashMovements.create({
                cm_user_id,
                cm_fecha,
                cm_tipo,
                cm_monto
            });
            res.status(201).json(movement);
        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json(req.cashMovement);
        } catch (error) {
            next(error);
        }
    }
}
