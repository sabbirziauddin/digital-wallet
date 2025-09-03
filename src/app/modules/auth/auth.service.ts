import  bcrypt  from 'bcryptjs';
import  httpStatus  from 'http-status-codes';
import { email } from "zod";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { Status } from '../user/user.interface';
import { createUserTokens } from '../../utils/userTokens';

const loginUser = async(email:string,password:string)=>{
    const user = await User.findOne({email}).select("+password");
    if(!user){
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }
    if (!user.password) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }
    const isPasswordMatch = await user.isPasswordMatched(password);
    if (!isPasswordMatch) {
        console.error("Login Error: Password comparison failed.");
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    // Check account status
    if (user.status === Status.BLOCKED || user.status === Status.INACTIVE || user.status === Status.PENDING) {
        throw new AppError(httpStatus.FORBIDDEN, "Your account is not active");
    }
    //generate token
    const tokens = createUserTokens(user);
    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        tokens,
    
    }
} 
export const AuthService = {
    loginUser,
}