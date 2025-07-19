import mongoose from "mongoose";
import { currencyTypes } from "../enums/CurrencyType.enum.js";
import { transactionStatus } from "../enums/TransactionStatus.enum.js";
import { paymentMethod } from "../enums/PaymentMethod.enum.js";
import { providerMetadataSchema } from "./ProviderMetaData.model.js";
import { encrypt, decrypt, sha256 } from "../utils/encryption/crypto.util.js";
import { transactionTypes } from "../enums/TransactionType.enum.js";

const transactionSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: Object.values(paymentMethod),
      default: paymentMethod.STRIPE,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(transactionTypes),
      default: transactionTypes.PAYMENT,
      required: false,
    },
    status: {
      type: String,
      enum: Object.values(transactionStatus),
      default: transactionStatus.PENDING,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    refundedAmount: {
      type: Number,
      required: false,
      default: 0,
    },

    currency: {
      type: String,
      enum: Object.values(currencyTypes),
      default: currencyTypes.USD,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentIntentId: {
      type: String,
      required: true,
    },

    userWallet: {
      type: String,
    },
    userWalletHash: { type: String, index: true },
    paymentIntentHash: { type: String, index: true },

    providerMetaData: providerMetadataSchema,
  },
  {
    timestamps: true,
  }
);

// Processing Accessors & Muttators
transactionSchema.pre("save", function (next) {
  if (this.isModified("userWallet") && this.userWallet) {
    this.userWalletHash = sha256(this.userWallet);
    this.userWallet = encrypt(this.userWallet);
  }

  if (this.isModified("paymentIntentId") && this.paymentIntentId) {
    this.paymentIntentHash = sha256(this.paymentIntentId);
    this.paymentIntentId = encrypt(this.paymentIntentId);
  }

  next();
});

transactionSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.userWallet) {
    update.userWalletHash = sha256(update.userWallet);
    update.userWallet = encrypt(update.userWallet);
  }

  if (update.paymentIntentId) {
    update.paymentIntentHash = sha256(update.paymentIntentId);
    update.paymentIntentId = encrypt(update.paymentIntentId);
  }

  this.setUpdate(update);
  next();
});

transactionSchema.methods.getDecryptedWallet = function () {
  return this.userWallet ? decrypt(this.userWallet) : null;
};

transactionSchema.methods.getDecryptedPaymentIntent = function () {
  try {
    return this.paymentIntentId
      ? JSON.parse(decrypt(this.paymentIntentId))
      : null;
  } catch {
    return null;
  }
};

export const Transaction = mongoose.model("Transaction", transactionSchema);
