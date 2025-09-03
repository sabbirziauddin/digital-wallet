import { model, Schema } from "mongoose";
import { ITransaction, TransactionType } from "./transaction.interface";

const transactionSchema  = new Schema<ITransaction>({
    from: { type: Schema.Types.ObjectId, ref: "Wallet", required: false, default: null },
    to:{type: Schema.Types.ObjectId,ref:"Wallet",required:false,default:null},
    amount:{type:Number,required:true,default:0},
    transactionType:{type:String,enum:Object.values(TransactionType),required:true,default:TransactionType.DEPOSIT},
    status:{type:String,default:"pending"}
},{
    timestamps:true,
    versionKey:false
})
export const Transaction = model<ITransaction>('Transaction',transactionSchema);