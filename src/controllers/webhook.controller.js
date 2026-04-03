import { stripe } from "../config/stripe.config.js";
import { transfer } from "../services/transfer.service.js";
import { Wallet } from "../model/wallet.model.js";
import { Transction } from "../model/transction.model.js";
import {asyncHandler} from "../utils/asyncHandler.js"

export const stripeWebhook = asyncHandler(async (req, res) => {

  const signature = req.headers["stripe-signature"];
  let event;

  /* VERIFY STRIPE  */
  try {
    event = stripe.webhooks.constructEvent(
      req.body,                        // VERY IMPORTANT
      signature,
      process.env.STRIPE_SIGNING_SCERET
    );
  } catch (err) {
    console.log("❌ Invalid Stripe Signature");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  /* HANDLE SUCCESSFUL PAYMENT */
  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    // payment not finalized yet
    if (session.payment_status !== "paid") {
      return res.json({ received: true });
    }

    try {

      /*  Extract metadata  */
      const userId = session.metadata.userId;
      const amount = Number(session.metadata.amount);

      if (!userId || !amount) {
        throw new Error("Metadata missing");
      }

      
     

      const existingTxn = await Transction.findOne({
        paymentId: session.payment_intent
      });

      if (existingTxn) {
        console.log(" Duplicate webhook ignored");
        return res.json({ received: true });
      }

      /*  Get treasury wallet  */
      const treasury = await Wallet.findOne({ type: "system" });
      if (!treasury) throw new Error("Treasury wallet missing");

      /* Get user's wallet */
      const userWallet = await Wallet.findOne({ userId });
      if (!userWallet) throw new Error("User wallet not found");

      /* Transfer money */
      await transfer({
        fromAccount: treasury._id,
        toAccount: userWallet._id,
        amt: amount,
        type: "deposit",
        paymentId: session.payment_intent
      });

      console.log(`✅ Wallet credited: ₹${amount} to user ${userId}`);

    } catch (err) {
      console.log("❌ Transfer failed:", err.message);
      return res.status(500).send("Webhook processing failed");
    }
  }

  /* Stripe requires 200 response ALWAYS */
  return res.json({ received: true });
}
);