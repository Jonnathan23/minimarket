import { Router } from "express";
import { authRouter } from "./app/security";

const router = Router();

router.use('/auth', authRouter);

export default router;