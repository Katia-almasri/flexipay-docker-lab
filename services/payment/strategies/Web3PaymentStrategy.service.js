import { PaymentStrategy } from "../../../abstracts/PaymentMethod.interface.js";
import { ethers } from "ethers";
import { web3NetworkTypes } from "../../../enums/Web3NetworkType.enum.js";
import dotenv from "dotenv";
import { providerTypes } from "../../../enums/ProviderType.enum.js";
import { v4 as uuidv4 } from "uuid";
import { createTransaction } from "../Transaction.service.js";
import { Transaction } from "../../../models/Transaction.model.js";
import { transactionStatus } from "../../../enums/TransactionStatus.enum.js";
import { web3ChainTypes } from "../../../enums/Web3ChainType.enum.js";
import { InternalServerError } from "../../../errors/InternalServerError.error.js";
import { UnprocessableEntity } from "../../../errors/UnprocessableEntityError.error.js";
import { decrypt } from "../../../utils/encryption/crypto.util.js";

dotenv.config();

export class web3PaymentStrategy extends PaymentStrategy {
  constructor() {
    super();
    this._provider = new ethers.JsonRpcProvider(
      process.env.INFURA_RPC_URL,
      web3NetworkTypes.SEPOLIA
    );
    this._wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this._provider);
  }

  // Getter:
  getProvider() {
    return web3PaymentStrategy._provider;
  }

  async pay(data) {
    if (!data.amount || isNaN(data.amount) || Number(data.amount) <= 0) {
      throw new UnprocessableEntity("Invalid amount");
    }
    let existingCredentials = Object.fromEntries(data.credentials);
    const walletAddress = existingCredentials.wallet_address;
    //1. create the transaction
    data = {
      amount: data.amount,
      currency: data.currency,
      provider: providerTypes.WEB3,
      customerId: data.user_id,
      merchantId: data.merchantId,
      userWallet: walletAddress,
      paymentIntentId: "0", //initially
      providerMetaData: {
        web3: {
          to: process.env.FLEXIPAY_PUBLIC_KEY,
          expectedAmount: data.amount.toString(),
          token: data.currency,
          chain: web3ChainTypes.ETHERIUM,
          paymentReference: uuidv4(),
        },
      },
    };
    const transaction = await createTransaction(data);
    return {
      transaction: transaction,
    };
  }

  async refund(transactionId, refundAmount) {
    try {
      const transaction = await Transaction.findById(transactionId);
      const toAddress = decrypt(transaction.userWallet);
      console.log(`🔁 Refunding ${refundAmount} ETH to ${toAddress}`);

      // Create the transaction
      const tx = await this._wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(transaction.amount.toString()),
        gasLimit: process.env.GAS_LIMIT,
      });

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        console.log("✅ Refund succeeded!");
        // update the transaction status
        await Transaction.findByIdAndUpdate(transactionId, {
          status: transactionStatus.CHARGE_REFUNDED,
          refundedAmount: refundAmount,
        });
        return {
          status: "success",
          txHash: tx.hash,
        };
      } else {
        console.error("❌ Refund failed in receipt");
        throw new InternalServerError("❌ Refund failed in receipt");
      }
    } catch (err) {
      if (err instanceof InternalServerError) {
        throw err;
      }

      console.error("❌ Unexpected refund error:", err);
      throw new InternalServerError("Unexpected refund error", err.message);
    }
  }
}
