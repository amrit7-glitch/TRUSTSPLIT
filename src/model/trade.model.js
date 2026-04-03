import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    symbol: {
        type: String,
        required: true  
    },
    companyName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["buy", "sell"],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true  // price at which trade happened
    },
    total: {
        type: Number,
        required: true  
    }
}, { timestamps: true });

export const Trade = mongoose.model("Trade", tradeSchema);