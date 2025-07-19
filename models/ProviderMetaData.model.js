import mongoose from "mongoose";
import { web3TokenTypes } from "../enums/Web3TokenType.enum.js";

export const providerMetadataSchema = new mongoose.Schema({
  stripe: {
    chargeId: String,
    paymentMethodId: String,
    receiptUrl: String,
  },
  paypal: {
    captureId: String,
    orderId: String,
    payerId: String,
  },
  web3: {
    to: String,
    expectedAmount: String,
    token: {
      type: String,
      enum: Object.values(web3TokenTypes),
      default: web3TokenTypes.ETHERIUM,
    },
    chain: String,
    paymentReference: String,
  },

  bank: {
    payoutId: String, // ID returned by Wise or other bank
    recipientId: String, // Wise recipient or account ID
    recipientName: String,
    iban: String,
    swift: String,
    referenceNote: String, // the memo sent to the bank
    createdAt: Date, // when the payout was initiated
    estimatedDeliveryDate: Date, // optional if provided by provider
  },
});

export const ProviderMetaData = mongoose.model(
  "ProviderMetaData",
  providerMetadataSchema
);
