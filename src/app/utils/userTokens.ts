import  httpStatus  from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env"
import { IUser, Status } from "../modules/user/user.interface"
import { generateJwtToken, verifyJwtToken } from "./jwt"
import { User } from "../modules/user/user.model";
import AppError from "../errorHelpers/AppError";

export const createUserTokens = (user:Partial<IUser>) =>{
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role:user.role
    }
    const accessToken = generateJwtToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRED_IN);
    console.log("from userTokens:",accessToken);
    const refreshToken = generateJwtToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRED_IN);
    return {
        accessToken,
        refreshToken
    }
};
export const createUserWithRefreshToken = async (refreshToken:string) =>{
    const verifiedRefreshToken = verifyJwtToken(refreshToken,envVars.JWT_REFRESH_SECRET as string) as JwtPayload;
    const isUserExist = await User.findOne({email: verifiedRefreshToken.email});
    if(!isUserExist){
        throw new AppError(httpStatus.NOT_FOUND,'User not found');
    }
    if(isUserExist.status === Status.BLOCKED||isUserExist.status === Status.INACTIVE||isUserExist.status === Status.PENDING){
        throw new AppError(httpStatus.FORBIDDEN,'Your account is not active yet. Please contact the support team.');

    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role:isUserExist.role
    
    };
    const accessToken = generateJwtToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRED_IN);
    return {
        accessToken
    }
   
}