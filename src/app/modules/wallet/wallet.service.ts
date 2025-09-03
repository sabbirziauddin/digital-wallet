import httpStatus from 'http-status-codes';
import { Types } from "mongoose";
import { Wallet } from "./wallet.model";
import AppError from "../../errorHelpers/AppError";
import { get } from 'http';
import { Transaction } from '../transaction/transaction.model';
import { TransactionType } from '../transaction/transaction.interface';
import { WalletStatus } from './wallet.interface';

//retrieve wallet by user id
const getWalletByUserId = async (userId: string) => {
    const wallet = await Wallet.findOne({ userId: new Types.ObjectId(userId) });
    return wallet;
}

// Deposit money into a user's wallet. Returns the updated wallet.
const Deposit = async (userId: string, amount: number) => {
    console.log("from wallet servide deposit-->", userId);
    if (!Number.isFinite(amount)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Amount must be a valid number");
    }
    if (amount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Deposit amount must be greater than zero");
    }
    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }
    if (wallet.status === WalletStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Wallet is blocked");
    }
    wallet.balance += amount;
    await wallet.save();
    await Transaction.create({
        from: wallet._id,
        to: wallet._id,
        amount,
        Types: TransactionType.DEPOSIT,
        status: "completed"
    })
    return wallet;
}
//Withdraw  money from a user's wallet. Returns the updated wallet.
const Withdraw = async (userId: string, amount: number) => {
    if (amount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Withdraw amount must be greater than zero");
    }
    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }
    if (wallet.status === WalletStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Wallet is blocked");
    }   
    if (wallet.balance < amount) {
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }
    wallet.balance -= amount;
    await wallet.save();
    await Transaction.create({
        from: wallet._id,
        to: null,
        amount,
        Types: TransactionType.WITHDRAW,
        status: "completed"
    })
    return wallet;
}
//transfer money from one user's wallet to another user'S wallet
const transferMoney = async (senderId: string, receiverId: string, amount: number) => {
    if (amount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Transfer amount must be greater than zero");
    }
    if (senderId === receiverId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cannot transfer to yourself");
    }
    const senderWallet = await getWalletByUserId(senderId);
    if (!senderWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Sender's wallet not found");
    }
    if (senderWallet.status === WalletStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Sender's wallet is blocked");
    }   
    const receiverWallet = await getWalletByUserId(receiverId);
    if (!receiverWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Receiver's wallet not found");
    }
    if (receiverWallet.status === WalletStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Receiver's wallet is blocked");
    }   
    if (senderWallet.balance < amount) {
        throw new AppError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    await senderWallet.save();
    await receiverWallet.save();
    await Transaction.create({
        from: senderWallet._id,
        to: receiverWallet._id,
        amount,
        Types: TransactionType.TRANSFER,
        status: "completed"
    })
    return { senderWallet, receiverWallet };
}
//agent deposits money into user's wallet
const cashIn = async (_agentId: string, targetUserId: string, amount: number) => {
    if (amount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cash in amount must be greater than zero");
    }
    const targetWallet = await getWalletByUserId(targetUserId);
    const agentWallet = await getWalletByUserId(_agentId);
    if (!agentWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Agent's wallet not found");
    }
    if (agentWallet.status === WalletStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Agent's wallet is blocked");
    }
    if (agentWallet.balance < amount) {
        throw new AppError(httpStatus.BAD_REQUEST, "Agent has insufficient balance");
    }

    if (!targetWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Target user's wallet not found");
    }
    if (targetWallet.status === WalletStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Target user's wallet is blocked");
    }
    //debit agent's wallet
    targetWallet.balance += amount;
    agentWallet.balance -= amount;
    await agentWallet.save();
    await targetWallet.save();
    await Transaction.create({
        from: null,
        to: targetWallet._id,
        amount,
        Types: TransactionType.CASH_IN,
        status: "completed"
    })
    return targetWallet;
}
//agent cashes out money from user's wallet
const cashOut = async (_agentId: string, targetUserId: string, amount: number) => {
    if (amount <= 0) {
        throw new AppError(httpStatus.BAD_REQUEST, "Cash out amount must be greater than zero");
    }
    const targetWallet = await getWalletByUserId(targetUserId);
    if (!targetWallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Target user's wallet not found");
    }
    if (targetWallet.status === WalletStatus.BLOCKED || targetWallet.status === WalletStatus.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, "Target user's wallet is blocked");
    }
    if (targetWallet.balance < amount) {
        throw new AppError(httpStatus.BAD_REQUEST, "Target user has insufficient balance");
    }
    targetWallet.balance -= amount;
    await targetWallet.save();
    //credit agent's wallet
    const agentWallet = await getWalletByUserId(_agentId);

    if (agentWallet) {
        agentWallet.balance += amount;
        await agentWallet.save();
    }
    await Transaction.create({
        from: targetWallet._id,
        to: agentWallet ? agentWallet._id : null,
        amount,
        Types: TransactionType.CASH_OUT,
        status: "completed"
    })
    return targetWallet;



}
//admin blocks a wallet by its id
const blowckWalletById = async (walletId: string) => {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }
    wallet.status = WalletStatus.BLOCKED;
    await wallet.save();
    return wallet;
}
//admin unblocks a wallet by its id
const unblockWalletById = async (walletId: string) => {
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
        throw new AppError(httpStatus.NOT_FOUND, "Wallet not found");
    }
    wallet.status = WalletStatus.ACTIVE;
    await wallet.save();
    return wallet;
}

export const walletService = {
    getWalletByUserId,
    Deposit,
    Withdraw,
    transferMoney,
    cashIn,
    cashOut,
    blowckWalletById,
    unblockWalletById





}