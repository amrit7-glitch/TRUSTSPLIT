import { Router } from "express";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { buyStock, sellStock, getPortfolio, getTradeHistory } from "../controllers/trade.controller.js";
import { searchStocks, getStockPrice } from "../services/stock.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const router = Router();

router.route("/search").get(verifyJWT, asyncHandler(async (req, res) => {
    const { q } = req.query;
    if (!q) throw new Error("Query required");
    const results = await searchStocks(q);
    return res.status(200).json(new ApiResponse(200, results, "Search results"));
}));

router.route("/price/:symbol").get(verifyJWT, asyncHandler(async (req, res) => {
    const stock = await getStockPrice(req.params.symbol);
    return res.status(200).json(new ApiResponse(200, stock, "Stock price fetched"));
}));

router.route("/buy").post(verifyJWT, buyStock);
router.route("/sell").post(verifyJWT, sellStock);
router.route("/portfolio").get(verifyJWT, getPortfolio);
router.route("/trades").get(verifyJWT, getTradeHistory);

export default router;