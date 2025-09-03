import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyJwtToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import { Status } from '../modules/user/user.interface';

export const auth =(...authRoles:string[]) =>async (req:Request,res:Response,next:NextFunction)  =>{

try {
    const accessToken = req.headers.authorization;
    if(!accessToken){
        throw new AppError(403,"You are not authorized to access this route")
    }
    const verifiedToken = verifyJwtToken(accessToken,envVars.JWT_SECRET) as JwtPayload; 
    const isUserExist = await User.findOne({email:verifiedToken.email});
    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"User not found");
    }
    if (isUserExist.status === Status.BLOCKED || isUserExist.status === Status.INACTIVE){
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.status}, please contact to admin`);
    }
    if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!!!")
    }
    req.user = verifiedToken;
    next();


    
} catch (error) {
   console.log("jwt error",error);
   next(error);
}

}

