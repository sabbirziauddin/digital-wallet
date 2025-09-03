import  httpStatus  from 'http-status-codes';
import { email } from 'zod';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsynch";
import { AuthService } from './auth.service';
import { sendResponse } from '../../utils/sendResponse';

/**
 * Login controller: accepts email and password, returns user info and tokens.
 */
const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {email,password} = req.body;
    const result = await AuthService.loginUser(email,password);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Login successful",
        data: result,
    });

})
export const AuthController = {
    login
}
