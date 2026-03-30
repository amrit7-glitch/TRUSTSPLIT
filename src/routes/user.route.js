
import { Router } from "express";
import {registerUser,loginUser} from '../controllers/user.controller.js'
//import {depositMoney} from "../controllers/wallet.controller.js"
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { createDepositeSession } from "../controllers/payment.controller.js";
import {stripeWebhook} from "../controllers/webhook.controller.js"
import { getWallet } from "../controllers/getwallet.controller.js"


const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/deposit-money").post(verifyJWT,createDepositeSession)
router.route("/webhook").post(stripeWebhook)
router.route("/get-wallet").get(verifyJWT, getWallet)

export default router

