import { NextFunction, Request, Response } from "express";
import { Users } from "../../../data/models/security";
import { BcryptAdapter, JwtAdapter } from "../../../utils";
import { AppError } from "../../../utils/AppError";
import Roles from "../../../data/models/security/Roles.model";

export class AuthController {

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { us_username, us_password_encriptado, us_nombre_completo, us_role_id } = req.body;

            if (!us_role_id) throw new AppError('Debes seleccionar un rol para el usuario', 400);

            const roleExists = await Roles.findByPk(us_role_id);
            if (!roleExists) throw new AppError('El rol seleccionado no es válido', 404);

            const passwordEncriptado = BcryptAdapter.hash(us_password_encriptado);
            const newUser = await Users.create({
                us_username,
                us_password_encriptado: passwordEncriptado,
                us_nombre_completo,
                us_estado: true,
                us_role_id
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

            const token = await JwtAdapter.generateToken({
                id: userFound.us_id,
                role: userFound.role.ro_nombre_del_rol
            });

            res.status(200).json({ token: token })
        } catch (error) {
            next(error);
        }
    }

    static getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await Users.findAll({
                attributes: ['us_id', 'us_username', 'us_nombre_completo'],
                include: [{ model: Roles, attributes: ['ro_nombre_del_rol'] }]
            });

            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
}