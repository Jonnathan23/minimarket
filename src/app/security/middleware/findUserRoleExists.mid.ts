import { Request, Response, NextFunction } from "express";
import { UserRolesI } from "../../../data/models/security";
import UserRoles from "../../../data/models/security/UserRoles.model";
import { AppError } from "../../../utils/AppError";




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
            throw new AppError('User role does not exist', 404);
        }

        req.userRole = userRole;
        next();
    } catch (error) {
        next(error);
    }
}


export const findUserRoleExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRole = await UserRoles.findOne({ where: { id: req.body.userRole_id } });
        if (userRole) {
            throw new AppError('User role already exists', 409);
        }

        next();
    } catch (error) {
        next(error);
    }
}