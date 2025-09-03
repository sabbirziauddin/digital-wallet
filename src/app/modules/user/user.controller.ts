import { verifyJwtToken } from './../../utils/jwt';
import httpStatus from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsynch";
import { userServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { envVars } from '../../config/env';

const createUser = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const user = await userServices.createUserIntoDb(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User created successfully",
        data: user
    })
})
const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.getAllUserFromDb();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User retrieved successfully",
        data: user
    })
})
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const token = req.headers.authorization;
    const verifyJwtTokenResult = verifyJwtToken(token as string, envVars.JWT_SECRET);
    const payload = req.body;
    const decodedToken = verifyJwtTokenResult;
    if (!decodedToken) {
        throw new Error("Invalid token");
    }
    const user = await userServices.updatuserintoDb(userId, payload, decodedToken);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User updated successfully",
        data: user
    })
})
export const userController = {
    createUser,
    getAllUser,
    updateUser
}