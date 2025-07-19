import express from "express";
import { stripeWebhook } from "../../controllers/payment/StripePaymentMethod.controller.js";
import { paypalWebhook } from "../../controllers/payment/PaypalPayment.controller.js";
import { web3Webhook } from "../../controllers/payment/Web3Payment.controller.js";
import bodyParser from "body-parser";

export let webhookRoutes = express.Router();

// Stripe
webhookRoutes.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

//Paypal
webhookRoutes.post(
  "/paypal",
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
  paypalWebhook
);

//Web3
webhookRoutes.post(
  "/web3",
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
  web3Webhook
);
