import httpStatus from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";
import { IAuthType, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import AppError from "../../errorHelpers/AppError";
import { envVars } from '../../config/env';

const createUserIntoDb = async (payload: Partial<IUser>) => {
    console.log("from user.service -->", payload);
    const { email, password, ...rest } = payload;

    if (!email) {
        throw new Error('Email is required to create a user.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Hash password if it is provided
    // let hashedPassword;
    // if (password) {
    //     hashedPassword = await bcrypt.hash(password, 10);
    // }

    const authProvider: IAuthType = {
        provider: "credentials",
        providerId: email
    }

    const user = await User.create({
        ...rest,
        email,
        password: password,
        auths: [authProvider],
    });
    //create wallet for the user automatically
    await Wallet.create({ userId: user._id })

    //without password
    const result = user.toObject();
    delete result.password;
    return result;
}
//get all user
const getAllUserFromDb = async () => {
    const users = await User.find();
    return users;
}
//get update user by id 
const updatuserintoDb = async (
    userId: string,
    payload: Partial<IUser>,
    decodedToken: JwtPayload
) => {
    //check user is valid or not
    if (userId !== decodedToken.userId) {
        throw new Error("You are not authorized to update this user")
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role !== Role.ADMIN) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            "You are not allowed to update super admin"
        );
    }
    if (payload.status || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "You are not allowed to update this user"
            );
        }
    }
    if (payload.password) {
        payload.password = await bcrypt.hash(
            payload.password,
            Number(envVars.BCRYPT_SALT_ROUNDS)
        );
    }
    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    if (!newUpdatedUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return newUpdatedUser;



}


export const userServices = {
    createUserIntoDb,
    getAllUserFromDb,
    updatuserintoDb
}