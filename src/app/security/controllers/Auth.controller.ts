import { NextFunction, Request, Response } from "express";
import { Users } from "../../../data/models/security";
import { BcryptAdapter, JwtAdapter } from "../../../utils";
import { AppError } from "../../../utils/AppError";

export class AuthController {

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { us_username, us_password_encriptado, us_nombre_completo } = req.body;

            const passwordEncriptado = BcryptAdapter.hash(us_password_encriptado);
            const newUser = await Users.create({
                us_username,
                us_password_encriptado: passwordEncriptado,
                us_nombre_completo,
                us_estado: true
            })

            res.status(201).send("User registered successfully");
        } catch (error) {
            next(error);
        }
    }

    static login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userFound = req.user;

            const passwordMatch = BcryptAdapter.compare(req.body.us_password_encriptado, userFound.us_password_encriptado);
            if (!passwordMatch) {
                throw new AppError('Invalid credentials', 401);
            }

            const token = await JwtAdapter.generateToken({ id: userFound.us_id });

            res.status(200).json({ token: token })
        } catch (error) {
            next(error);
        }
    }

}