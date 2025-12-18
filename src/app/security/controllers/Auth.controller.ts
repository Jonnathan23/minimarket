import { Request, Response } from "express";
import { Users } from "../../../data/models/security";
import { BcryptAdapter } from "../../../utils";

export class AuthController {

    static async register(req: Request, res: Response) {
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
            res.status(500).json({ errors: error })
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const userFound = req.user;

            const passwordMatch = BcryptAdapter.compare(req.body.us_password_encriptado, userFound.us_password_encriptado);
            if (!passwordMatch) {
                return res.status(401).json({ errors: 'Invalid credentials' })
            }

            res.status(200).json(userFound)
        } catch (error) {
            res.status(500).json({ errors: error })
        }
    }

}