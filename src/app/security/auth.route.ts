import { Router } from "express";
import { AuthController } from ".";
import { findUserExists, validateUserExists } from "./middleware/findUserExists.mid";
import { handleInputErrors } from "../../middleware/handleErrors.mid";
import { body } from "express-validator";



export const authRouter = Router();

//? Auth
authRouter.post('/register',
    body('us_username')
        .notEmpty().withMessage("All fields are required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),

    body('us_password_encriptado')
        .notEmpty().withMessage("All fields are required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    body('us_nombre_completo')
        .notEmpty().withMessage("All fields are required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    findUserExists,
    handleInputErrors,
    AuthController.register
);


authRouter.post('/login',
    body('us_username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 6 }).withMessage('Username must be at least 6 characters long'),

    body('us_password_encriptado')
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    validateUserExists,
    handleInputErrors,
    AuthController.login
);
