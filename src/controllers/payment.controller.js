import { stripe } from "../config/stripe.config.js";
import {Wallet} from "../model/wallet.model.js"
import { ApiError } from "../utils/apiError.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"

export const createDepositeSession = asyncHandler(async (req,res)=>{
        const {amount} = req.body;
        const userId = req.user._id;

        if(!amount || amount <= 0){
        throw new ApiError(400, "Invalid amount");
    }

    const amountInPaise = amount * 100;

   // did not understand fully

   //Stripe does:

/*  Creates a payment session

    Generates a hosted checkout page

    Waits for the user to pay

    
*/
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "TrustSplit Wallet Deposit",
                    },
                    unit_amount: amountInPaise,
                },
                quantity: 1,
            },
        ],

        // CRITICAL
        metadata: {
            userId: userId.toString(),
            amount: amount.toString()
        },

        success_url: `${process.env.CLIENT_URL}/?payment=success`,
        cancel_url: `${process.env.CLIENT_URL}/?payment=cancelled`,
    });

    return res
    .status(200)
    .json(new ApiResponse(200,{url: session.url},"waiting for user to pay"));

    
})