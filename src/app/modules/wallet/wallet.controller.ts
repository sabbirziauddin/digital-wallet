
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsynch";
import { walletService } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";

//Deposit money into current's user wallet
const depositMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const { balance } = req.body;
    const wallet = await walletService.Deposit(userId as string, Number(balance));
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Deposit successful",
        data: wallet,
    });

})
//Withdraw money from current's user wallet
const withdrawMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const { balance } = req.body;
    const wallet = await walletService.Withdraw(userId as string, Number(balance));
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Withdraw successful",
        data: wallet,
    });
})
const transferMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const senderId = req.user?.userId;
    const { receiverId, balance } = req.body;

    const result = await walletService.transferMoney(senderId as string, receiverId, Number(balance));
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Transfer successful",
        data: result,
    });
})
//agent cash-in to user's wallet
const cashIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const agentId = req.user?.userId;
    const { targetUserId, balance } = req.body;
    const wallet = await walletService.cashIn(agentId as string, targetUserId, Number(balance));
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cash in successful",
        data: wallet,
    });
})
//agent cash-out from user's wallet
const cashOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const agentId = req.user?.userId;
    const { targetUserId, balance } = req.body;
    const wallet = await walletService.cashOut(agentId as string, targetUserId, Number(balance));
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cash out successful",
        data: wallet,
    });
})
//admin blocks a wallet by its id
const blockWalletById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { walletId } = req.params;
    const wallet = await walletService.blowckWalletById(walletId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Wallet blocked successfully",
        data: wallet,
    });

})
//admin unblocks a wallet by its id
const unblockWalletById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { walletId } = req.params;
    const wallet = await walletService.unblockWalletById(walletId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Wallet unblocked successfully",
        data: wallet,
    });
})



export const walletController = {
    depositMoney,
    withdrawMoney,
    transferMoney,
    cashIn,
    cashOut,
    blockWalletById,
    unblockWalletById
}   
