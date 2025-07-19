import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema({
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  accountHolderName: String,
  iban: String,
  swift: String,
  accountNumber: String,
  currency: String,
  balance: Number,
  lastPayoutDate: Date,
});

export const Merchant = mongoose.model("Merchant", merchantSchema);
