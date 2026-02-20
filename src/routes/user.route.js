import { Router } from "express";
import {registerUser,loginUser} from '../controllers/user.controller.js'
import {depositMoney} from "../controllers/wallet.controller.js"
import { verifyJWT } from "../middlewares/authentication.middleware.js";
const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)
router.route("/addMoney").post(verifyJWT,depositMoney)

export default router