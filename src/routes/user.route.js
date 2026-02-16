import { Router } from "express";
import {registerUser,loginUser} from '../controllers/user.controller.js'
import {depositMoney} from "../controllers/wallet.controller.js"
const router = Router();

router.route("/register").post(registerUser)
router.route("/addMoney").post(depositMoney)
router.route("/login").post(loginUser)

export default router