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
        userId:      { type: String },
        symbol:      { type: String },
        companyName: { type: String },
        type:        { type: String },
        quantity:    { type: Number },
        price:       { type: Number },
        total:       { type: Number },
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