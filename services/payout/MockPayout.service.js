import { paymentMethod } from "../../enums/PaymentMethod.enum.js";
import { transactionStatus } from "../../enums/TransactionStatus.enum.js";
import dotenv from "dotenv";
import { createTransaction } from "../payment/Transaction.service.js";
import mongoose from "mongoose";
import { transactionTypes } from "../../enums/TransactionType.enum.js";

dotenv.config();

export class MockPayoutService {
  async sendPayout(details) {
    const data = {
      provider: paymentMethod.BANK,
      type: transactionTypes.PAYOUT,
      status: transactionStatus.SUCCEED,
      amount: details.amount,
      currency: details.currency,
      customerId: new mongoose.Types.ObjectId(
        process.env.PLATFORM_SENDER_PROFIT_ACCOUNT
      ), // admin id who specifies for distributing the profit to merchants
      merchantId: details.merchantId,
      userWallet: null,
      paymentIntentId: "34506943rfgdcedo30",
      providerMetaData: {
        bank: {
          payoutId: "233487yg4rc", // ID returned by Wise or other bank
          recipientId: details.merchantId.toString(), // Wise recipient or account ID
          recipientName: "some reciepent name",
          iban: details.iban,
          swift: details.swift,
          referenceNote: "memo sent", // the memo sent to the bank
        },
      },
    };
    const transaction = await createTransaction(data);
    console.log(transaction);
    // console.log("🧪 [Mock] Pretending to send payout:", details);
    return {
      success: true,
      transactionId: `MOCK-${Date.now()}`,
      recipientId: "MOCK_RECIPIENT_ID",
    };
  }
}
