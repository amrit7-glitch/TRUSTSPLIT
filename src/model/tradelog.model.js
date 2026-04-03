import mongoose from "mongoose";

const tradeLogSchema = new mongoose.Schema({
    blockIndex: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    tradeData: {
        userId:      String,
        symbol:      String,
        companyName: String,
        type:        String,
        quantity:    Number,
        price:       Number,
        total:       Number,
    },
    previousHash: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
}, { timestamps: false });

export const TradeLog = mongoose.model("TradeLog", tradeLogSchema);