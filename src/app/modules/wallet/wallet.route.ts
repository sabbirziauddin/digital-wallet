import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../user/user.interface";
import { walletController } from "./wallet.controller";

const router = Router();
//user endpoint 
router.post("/deposit", auth(...Object.values(Role)), walletController.depositMoney)
router.post("/withdraw", auth(...Object.values(Role)), walletController.withdrawMoney)
router.post("/transfer", auth(...Object.values(Role)), walletController.transferMoney)
router.post("/cash-in", auth(Role.AGENT), walletController.cashIn)
router.post("/cash-out", auth(Role.AGENT), walletController.cashOut)
router.patch("/block-wallet/:walletId", auth(Role.SUPER_ADMIN, Role.ADMIN), walletController.blockWalletById)
router.patch("/unblock-wallet/:walletId", auth(Role.SUPER_ADMIN, Role.ADMIN), walletController.unblockWalletById)

export const walletRoutes = router;