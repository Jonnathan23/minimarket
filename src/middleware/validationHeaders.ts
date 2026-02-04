import { Request, Response, NextFunction } from "express";

import { Users } from "../data/models/security";
import { AppError } from "../utils/AppError";

import { JwtAdapter } from "../utils";


declare global {
    namespace Express {
        interface Request {
            user: Users
        }
    }
}


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        throw new AppError('No autorizado', 401)
    }

    const [, token] = bearer.split(' ')

    try {
        const decoded = await JwtAdapter.validateToken<{ id: string }>(token)

        if (!decoded) {
            throw new AppError('Token inválido o expirado', 401)
        }

        if (!decoded.id) {
            throw new AppError('Token malformado', 401)
        }

        const user = await Users.findByPk(decoded.id)

        if (!user) {
            throw new AppError('Usuario no encontrado', 404)
        }

        req.user = user
        next()
    } catch (error) {
        next(new AppError('Token inválido', 401))
    }
}