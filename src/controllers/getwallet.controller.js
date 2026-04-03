import { asyncHandler } from "../utils/asyncHandler.js";
import { Wallet } from "../model/wallet.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export const getWallet = asyncHandler(async (req, res) => {
    const wallet = await Wallet.findOne({ userId: req.user._id });
    if (!wallet) throw new ApiError(404, "Wallet not found");
    return res.status(200).json(new ApiResponse(200, wallet, "Wallet fetched"));
})