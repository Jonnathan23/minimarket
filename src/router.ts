import { Router } from "express";
import { securityRoute } from "./app/security";

const router = Router();

router.use('/auth', securityRoute);

export default router;