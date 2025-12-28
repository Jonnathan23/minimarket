import { NextFunction, Request, Response } from "express";
import { Users } from "../../../data/models/security";

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
            res.status(400).json({ message: 'User already exists' });
            return
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const validateUserExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await Users.findOne({ where: { us_username: req.body.us_username } });
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}