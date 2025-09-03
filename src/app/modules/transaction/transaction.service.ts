//create a new transaction record

import { Types } from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";

const createTransaction = async (payload:Partial<ITransaction>) => {
    return await Transaction.create(payload);

}
//get transaction for a specific user by their userId
//This looks up the user's wallet and returns all transactions
 // where they are either the sender or the receiver.
const getTransactionsByUserId = async (userId:string) => {
    const wallet = await Wallet.findOne({ userId: new Types.ObjectId(userId) });
if (!wallet) {
    return [];
}
const walletId = wallet._id;
return await Transaction.find({
    $or: [
        { from: walletId },
        { to: walletId }],           
}).sort({ createdAt: -1 });
}
//get all transaction (Admin and super admin only)
const getAllTransactions = async() =>{
    return await Transaction.find().sort({ createdAt: -1 });
}
export const transactionService = {
    createTransaction,
    getTransactionsByUserId,
    getAllTransactions

}