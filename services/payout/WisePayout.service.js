// src/services/payouts/wisePayoutService.js
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import { bankTokens } from "../../enums/bank/BankToken.enum.js";
import { legalTypes } from "../../enums/bank/LegalType.enum.js";
import { Transaction } from "../../models/Transaction.model.js";
import { paymentMethod } from "../../enums/PaymentMethod.enum.js";
import { transactionStatus } from "../../enums/TransactionStatus.enum.js";
import { transactionTypes } from "../../enums/TransactionType.enum.js";

dotenv.config();

export class WisePayoutService {
  constructor() {
    this.apiUrl = "https://api.transferwise.com/v1";
    this.apiKey = process.env.WISE_API_KEY;
    this.profileId = process.env.WISE_PROFILE_ID;
  }

  async sendPayout(details) {
    try {
      let recipientId = details.recipientId;

      // If recipientId not provided, create it and return it for saving
      if (!recipientId) {
        const recipientRes = await axios.post(
          `${this.apiUrl}/accounts`,
          {
            currency: details.currency,
            type: bankTokens.IBAN,
            profile: this.profileId,
            accountHolderName: details.recipientName,
            legalType: legalTypes.PRIVATE,
            details: {
              iban: details.iban,
              swift_code: details.swift,
            },
          },
          {
            headers: { Authorization: `Bearer ${this.apiKey}` },
          }
        );

        recipientId = recipientRes.data.id;
      }

      // Quote + transfer as usual...
      const quoteRes = await axios.post(
        `${this.apiUrl}/quotes`,
        {
          sourceCurrency: details.currency,
          targetCurrency: details.currency,
          sourceAmount: details.amount,
          profile: this.profileId,
        },
        {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        }
      );

      const quoteId = quoteRes.data.id;

      const transferRes = await axios.post(
        `${this.apiUrl}/transfers`,
        {
          targetAccount: recipientId,
          quoteUuid: quoteId,
          customerTransactionId: crypto.randomUUID(),
          details: {
            reference: details.reference,
          },
        },
        {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        }
      );
      const data = {
        provider: paymentMethod.BANK,
        status: transactionStatus.SUCCEED,
        type: transactionTypes.PAYOUT,
        amount: details.amount,
        currency: details.currency,
        customerId: new mongoose.Types.ObjectId(
          process.env.PLATFORM_SENDER_PROFIT_ACCOUNT
        ), // admin id who specifies for distrib
        merchantId: details.merchantId,
        userWallet: null,
        paymentIntentId: transferRes.data.id,
        providerMetaData: {
          bank: {
            payoutId: transferRes.data.id, // ID returned by Wise or other bank
            recipientId: details.merchantId.toString(), // Wise recipient or account ID
            recipientName: details.recipientName,
            iban: details.iban,
            swift: details.swift,
            referenceNote: transferRes.memo,
          },
        },
      };
      const transaction = await Transaction.create(data);

      return {
        success: true,
        transactionId: transferRes.data.id,
        recipientId, // return this if newly created
      };
    } catch (error) {
      return { success: false, error };
    }
  }
}
