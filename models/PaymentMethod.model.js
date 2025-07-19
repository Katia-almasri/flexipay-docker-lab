import mongoose from "mongoose";
import { paymentMethod } from "../enums/PaymentMethod.enum.js";

export const paymentMethodSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(paymentMethod),
      required: true,
    },
    credentials: {
      type: Map,
      of: String,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentMethod = mongoose.model(
  "PaymentMethod",
  paymentMethodSchema
);
