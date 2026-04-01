import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { getStockPrice } from "../services/stock.service.js";
import { Portfolio } from "../model/portfolio.model.js";
import { Trade } from "../model/trade.model.js";
import { Wallet } from "../model/wallet.model.js";

/* ============ BUY STOCK ============ */
export const buyStock = asyncHandler(async (req, res) => {
    const { symbol, quantity } = req.body;
    const userId = req.user._id;

    if (!symbol || !quantity || quantity <= 0) {
        throw new ApiError(400, "Symbol and valid quantity required");
    }

    // get real time price
    const stock = await getStockPrice(symbol);
    const totalCost = stock.currentPrice * quantity;

    // check wallet balance
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) throw new ApiError(404, "Wallet not found");
    if (wallet.availableBalance < totalCost) {
        throw new ApiError(400, `Insufficient balance. Need ₹${totalCost.toFixed(2)}, have ₹${wallet.availableBalance.toFixed(2)}`);
    }

    // deduct from wallet
    wallet.availableBalance -= totalCost;
    await wallet.save();

    // update portfolio
    const existing = await Portfolio.findOne({ userId, symbol });
    if (existing) {
        // average out the buy price
        const totalQuantity = existing.quantity + quantity;
        const totalInvested = existing.totalInvested + totalCost;
        existing.quantity = totalQuantity;
        existing.totalInvested = totalInvested;
        existing.avgBuyPrice = totalInvested / totalQuantity;
        await existing.save();
    } else {
        await Portfolio.create({
            userId,
            symbol,
            companyName: stock.companyName,
            quantity,
            avgBuyPrice: stock.currentPrice,
            totalInvested: totalCost
        });
    }

    // record trade
    await Trade.create({
        userId,
        symbol,
        companyName: stock.companyName,
        type: "buy",
        quantity,
        price: stock.currentPrice,
        total: totalCost
    });

    return res.status(200).json(new ApiResponse(200, {
        symbol,
        quantity,
        price: stock.currentPrice,
        totalCost,
        walletBalance: wallet.balance
    }, `Successfully bought ${quantity} shares of ${symbol}`));
});

/* ============ SELL STOCK ============ */
export const sellStock = asyncHandler(async (req, res) => {
    const { symbol, quantity } = req.body;
    const userId = req.user._id;

    if (!symbol || !quantity || quantity <= 0) {
        throw new ApiError(400, "Symbol and valid quantity required");
    }

    // check portfolio
    const holding = await Portfolio.findOne({ userId, symbol });
    if (!holding) throw new ApiError(404, "You don't own this stock");
    if (holding.quantity < quantity) {
        throw new ApiError(400, `You only have ${holding.quantity} shares`);
    }

    // get real time price
    const stock = await getStockPrice(symbol);
    const totalEarned = stock.currentPrice * quantity;

    // credit wallet
    const wallet = await Wallet.findOne({ userId });
    wallet.availableBalance += totalEarned;
    await wallet.save();

    // update portfolio
    holding.quantity -= quantity;
    holding.totalInvested -= holding.avgBuyPrice * quantity;
    if (holding.quantity === 0) {
        await Portfolio.deleteOne({ userId, symbol });
    } else {
        await holding.save();
    }

    // record trade
    await Trade.create({
        userId,
        symbol,
        companyName: stock.companyName,
        type: "sell",
        quantity,
        price: stock.currentPrice,
        total: totalEarned
    });

    const profitLoss = (stock.currentPrice - holding.avgBuyPrice) * quantity;

    return res.status(200).json(new ApiResponse(200, {
        symbol,
        quantity,
        price: stock.currentPrice,
        totalEarned,
        profitLoss: profitLoss.toFixed(2),
        walletBalance: wallet.availableBalance
    }, `Successfully sold ${quantity} shares of ${symbol}`));
});

/* ============ GET PORTFOLIO ============ */
export const getPortfolio = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const holdings = await Portfolio.find({ userId });

    // get current prices for all holdings
    const portfolioWithPrices = await Promise.all(
        holdings.map(async (holding) => {
            const stock = await getStockPrice(holding.symbol);
            const currentValue = stock.currentPrice * holding.quantity;
            const profitLoss = currentValue - holding.totalInvested;
            const profitLossPercent = ((profitLoss / holding.totalInvested) * 100).toFixed(2);

            return {
                symbol: holding.symbol,
                companyName: holding.companyName,
                quantity: holding.quantity,
                avgBuyPrice: holding.avgBuyPrice,
                currentPrice: stock.currentPrice,
                totalInvested: holding.totalInvested,
                currentValue,
                profitLoss: profitLoss.toFixed(2),
                profitLossPercent
            };
        })
    );

    return res.status(200).json(new ApiResponse(200, portfolioWithPrices, "Portfolio fetched"));
});

/* ============ GET TRADE HISTORY ============ */
export const getTradeHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const trades = await Trade.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, trades, "Trade history fetched"));
});