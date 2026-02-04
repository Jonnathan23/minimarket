import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { AppError } from '../utils/AppError'

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(', ');
        throw new AppError(errorMessages, 400);
    }

    next()
}