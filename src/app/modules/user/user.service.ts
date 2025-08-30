import { Wallet } from "../wallet/wallet.model";
import { IAuthType, IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";

const createUserIntoDb = async (payload: Partial<IUser>) => {
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

export const userServices = {
    createUserIntoDb
}