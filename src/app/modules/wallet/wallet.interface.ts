import { Types } from "mongoose";

export  enum WalletStatus{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
    
}
export interface IWallet {
    userId: Types.ObjectId, 
    balance: number,
    status:WalletStatus
}