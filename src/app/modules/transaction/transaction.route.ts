import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { transactionController } from "./transaction.controller";
import { Role } from "../user/user.interface";

const router = Router();
//get own transaction history (admin,user,agent)
router.get("/me",auth(...Object.values(Role)),transactionController.getUserTransactions)
//get all transaction by admin and super admin
router.get("/all",auth(Role.SUPER_ADMIN,Role.ADMIN),transactionController.getAllTransactions)

export const transactionRoutes = router;