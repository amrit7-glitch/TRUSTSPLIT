import { Router } from "express";
import {stripeWebhook} from "../controllers/webhook.controller.js"

const router = Router();

router.route("/webhook").post(stripeWebhook)

export default router