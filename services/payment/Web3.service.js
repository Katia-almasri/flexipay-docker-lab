import { statusCode } from "../../enums/common/StatusCode.enum.js";
import { transactionStatus } from "../../enums/TransactionStatus.enum.js";
import { Transaction } from "../../models/Transaction.model.js";
import { providerTypes } from "../../enums/ProviderType.enum.js";
import { encrypt, sha256 } from "../../utils/encryption/crypto.util.js";

export let implementWebhook = async (data) => {
  try {
    const fromAddress = data.fromAddress;
    const transactionHash = data.transactionHash;
    const amount = data.amount;
    if (!fromAddress || !transactionHash) {
      return {
        data: null,
        msg: "⚠️ Missing fromAddress or transactionHash in webhook data",
        code: statusCode.NOT_FOUND,
      };
    }

    const fromWalletHash = sha256(fromAddress);
    const paymentIntentHash = sha256("0");
    const transaction = await Transaction.findOneAndUpdate(
      {
        userWalletHash: fromWalletHash,
        provider: providerTypes.WEB3,
        paymentIntentHash: paymentIntentHash,
        status: transactionStatus.PENDING,
        amount: amount,
      },

      {
        status: transactionStatus.SUCCEED,
        paymentIntentId: transactionHash,
      },
      { new: true }
    );

    if (!transaction) {
      return {
        data: null,
        msg: `⚠️ No pending transaction found for address ${fromAddress}`,
        code: statusCode.NOT_FOUND,
      };
    } else {
      return {
        data: null,
        msg: `✅ Transaction updated: ${transaction._id}`,
        code: statusCode.NOT_FOUND,
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
