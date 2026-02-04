import { NextFunction, Request, Response } from "express";
import { Users } from "../../../data/models/security";
import { AppError } from "../../../utils/AppError";

declare global {
    namespace Express {
        interface Request {
            user: Users,
        }
    }
}



export const findUserExists = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await Users.findOne({ where: { us_username: req.body.us_username } });
        if (user) {
            throw new AppError('User already exists', 409);
        }
        next();
    } catch (error) {
        next(error);
    }
}


export const validateUserExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await Users.findOne({ where: { us_username: req.body.us_username } });
        if (!user) {
            throw new AppError('User not found', 404);
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}