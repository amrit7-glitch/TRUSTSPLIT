import { Router } from "express";
import {registerUser,loginUser} from '../controllers/user.controller.js'
import {depositMoney} from "../controllers/wallet.controller.js"
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import {sendmoney} from "../controllers/sendMoney.js"
const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/send-money").post(verifyJWT,sendmoney)

export default router