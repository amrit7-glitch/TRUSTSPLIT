
import { Wallet } from "../model/wallet.model.js";
import { ApiError } from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";

const depositMoney = asyncHandler(async (req,res)=> {
    const {userId,amount} = req.body;

    if(amount<=0){
        throw new ApiError(400,"invalid amount")
    }

    const wallet = await Wallet.findById(userId)

    if(!wallet){
        throw new ApiError(404,"wallet not found")
    }

    wallet.availableBalance += amount;
    await wallet.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(200,wallet.availableBalance," available amount")
    )
})

export {depositMoney}