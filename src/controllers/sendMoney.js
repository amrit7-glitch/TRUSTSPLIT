import { Transction } from "../model/transction.model.js";
import {Wallet} from "../model/wallet.model.js"
import { transfer } from "../services/transfer.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import  mongoose  from "mongoose";


const sendmoney =  asyncHandler(async (req,res)=>{

   

        const {toAccount,amt,} = req.body;
        
        if(!toAccount || !amt){
            throw new ApiError(400,"all field required")
        }

        const userid = req.user._id;

        const senderWallet = await Wallet.findOne({user: userid});

        if(!senderWallet){
            throw new ApiError(404,"wallet not found")
        }

        const sent = await transfer({
            fromAccount:senderWallet._id,
            toAccount,
            amt,
            type:"transfer",

        })

        return res
        .status(200)
        .json(
            new ApiResponse(200,sent,"transfer complete")
        )


})

export {sendmoney}