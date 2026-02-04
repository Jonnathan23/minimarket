import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';


export const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    
    console.error('ERROR 💥:', err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ 
            errors: err.errors 
        });
    }

    const internalError = new AppError('Error interno del servidor, por favor intente más tarde', 500);
    
    return res.status(500).json({
        errors: internalError.errors 
    });
};