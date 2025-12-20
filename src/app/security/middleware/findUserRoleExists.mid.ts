import { Request, Response, NextFunction } from "express";
import { UserRolesI } from "../../../data/models/security";
import UserRoles from "../../../data/models/security/UserRoles.model";




declare global {
    namespace Express {
        interface Request {
            userRole: UserRolesI,
        }
    }
}


export const validateUserRoleExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRole = await UserRoles.findOne({ where: { id: req.body.userRole_id } });
        if (!userRole) {
            res.status(400).json({ message: 'User role does not exist' });
            return
        }

        req.userRole = userRole;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const findUserRoleExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRole = await UserRoles.findOne({ where: { id: req.body.userRole_id } });
        if (userRole) {
            res.status(400).json({ message: 'User role already exists' });
            return
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}