import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    symbol: {
        type: String,
        required: true  // e.g. "RELIANCE.NS"
    },
    companyName: {
        type: String,
        required: true  // e.g. "Reliance Industries"
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    avgBuyPrice: {
        type: Number,
        required: true,
        default: 0
    },
    totalInvested: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

// one user can hold one stock only — no duplicates
portfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);