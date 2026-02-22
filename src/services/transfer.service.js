import { Wallet } from "../model/wallet.model.js";
import { Transction } from "../model/transction.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";


const transfer = async ({
    fromAccount,
    toAccount,
    amt,
    type,
    paymentId = null
})=>{
    // converting amount from string to number 
        const amount = Number(amt);

     if(!fromAccount || !toAccount || !type){
        throw new ApiError(400,"missing fields")
     }
     if(!isFinite(amount) || amount <=0){
        throw new ApiError(400,"invalid amount entered")
     }
     if(fromAccount.toString() === toAccount.toString()){
        throw new ApiError(400,"cannot transfer to the same account")
     }

    const session = await mongoose.startSession(); // 
   // session.startTransaction(); 
   //  I will not permanently apply any DB change until you explicitly confirm.
   // without this mongodb will not do the roll back transction when intrupped in between 



        
        

       try {
         session.startTransaction(); 
     
 
     const sender = await Wallet.findById(fromAccount).session(session)
     const recevier = await Wallet.findById(toAccount).session(session)
 
     if(!sender || !recevier){
         throw new ApiError(404,"wallet not found")
     }
 
     if(sender.availableBalance < amount){
         throw new ApiError(400,"insufficient fund")
     }

     // checking for double send form same id
     if(paymentId){
    const existing = await Transction.findOne({ paymentId }).session(session);
    if(existing) return existing;
}
 
     // recording the transction
    const txn =  await Transction.create([{
         fromAccount:sender._id,
         toAccount:recevier._id,
         amount,
         type,
         paymentId,
         
 
     }],{session}
 
     )
 
     // moving the money
     sender.availableBalance -= amount;
     recevier.availableBalance += amount;
 
     // saving on to the database
     await sender.save({session});
     await recevier.save({session});


     // marking success
      txn[0].status="success";
        await txn[0].save({ session });
 
      
     /*
     mark commit then only mongodb complete the transction 
         permanently updates both balances
     permanently stores transaction
         If server crashed before this line → MongoDB automatically cancels everything.
     No money lost.
     */ 
     await session.commitTransaction();
     
 
     
 
       } catch (error) {
        await session.abortTransaction();
        
        throw new ApiError(500,error.message ||"internal error")
       } finally{
        session.endSession();
       }
}

export {transfer}