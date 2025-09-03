import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsynch";
import { transactionService } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";

/**
 * Controller to fetch current user's transaction history.
 * Requires authentication; the middleware populates req.user.
 */
const getUserTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const transactions = await transactionService.getTransactionsByUserId(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User transactions fetched successfully",
        data: transactions,
    }); 

})
//get all transaction by admin and super admin
const getAllTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const transactions = await transactionService.getAllTransactions();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All transactions fetched successfully",
        data: transactions,
    });
})

export const transactionController = {
    getUserTransactions,
    getAllTransactions
} 