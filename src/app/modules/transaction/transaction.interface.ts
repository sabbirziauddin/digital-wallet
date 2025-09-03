import { Types } from "mongoose";

export enum TransactionType {
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
    TRANSFER = "TRANSFER",
    CASH_IN = "CASH_IN",
    CASH_OUT = "CASH_OUT",
}

export interface ITransaction{
    from?: Types.ObjectId | null,
    to?: Types.ObjectId | null,
    amount: number,
    transactionType: TransactionType,
    status:string,
    createdAt?: Date,
    updatedAt?: Date,

}