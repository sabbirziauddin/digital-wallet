import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

//user login route
router.post('/login',AuthController.login);

export const authRoutes = router;