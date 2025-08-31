import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register",userController.createUser)
router.get("/allusers", userController.getAllUser)
router.patch("/:id", userController.updateUser)

export const userRoutes = router;