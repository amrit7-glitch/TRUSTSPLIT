import "./loadEnv.js";
import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECERET_KEY,{
    apiVersion:"2024-06-20"
})
