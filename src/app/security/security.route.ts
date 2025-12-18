import { Router } from "express";
import { authenticate } from "../../middleware/validationHeaders";


export const securityRoute = Router();

securityRoute.use(authenticate);



