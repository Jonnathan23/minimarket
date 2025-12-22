import { Request, Response, NextFunction } from "express";

import { Users } from "../data/models/security";

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
        res.status(401).json({ error: 'No autorizado' })
        return
    }

    const [, token] = bearer.split(' ')

    try {
        const decoded = await JwtAdapter.validateToken<{ id: string }>(token)

        if (!decoded) {
            res.status(401).json({ error: 'Token inválido o expirado' })
            return
        }

        if (!decoded.id) {
            res.status(401).json({ error: 'Token malformado' })
            return
        }

        const user = await Users.findByPk(decoded.id)

        if (!user) {
            res.status(401).json({ error: 'Usuario no encontrado' })
            return
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' })
    }
}