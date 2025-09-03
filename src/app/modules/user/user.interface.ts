import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT = "AGENT"
}
export enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
    PENDING = "PENDING"
}
export interface IAuthType {
    provider: string,
    providerId: string,
}
export interface IUser {
    name?: string,
    email: string,
    password?: string,
    role?: Role,
    status?: Status,
    auths?: IAuthType[],
    _id?: Types.ObjectId,
    isDeleted?: boolean,
    isVerified?: boolean,
    isPasswordMatched(password: string): Promise<boolean>;

}
