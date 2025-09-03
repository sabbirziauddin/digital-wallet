import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createZodUserSchema } from "./user.validation";

const router = Router();

router.post("/register", validateRequest(createZodUserSchema), userController.createUser)
router.get("/allusers", userController.getAllUser)
router.patch("/:id", userController.updateUser)

export const userRoutes = router;