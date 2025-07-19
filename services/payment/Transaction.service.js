import { Transaction } from "../../models/Transaction.model.js";
import {
  transactionResource,
  transactionCollection,
} from "../../resources/payment/Transaction.resource.js";
import { orderTypes } from "../../enums/common/OrderType.enum.js";

export let createTransaction = async (data) => {
  const transaction = await Transaction.create(data);
  return await transactionResource(transaction);
};

export let updateTransactionByCriteria = async (criteria, data) => {
  const transaction = await Transaction.findOneAndUpdate(criteria, data, {
    new: true,
  });
  return await transactionResource(transaction);
};

export let getTransactionsByCustomer = async (
  userId,
  filter,
  order = orderTypes.DESC
) => {
  console.log(filter);
  let transactions = await Transaction.find({ customerId: userId }).sort({
    createdAt: order == orderTypes.DESC ? -1 : +1,
  });
  if (filter?.status)
    transactions = transactions.filter(
      (transaction) => transaction.status === filter.status
    );

  if (filter?.provider)
    transactions = transactions.filter(
      (transaction) => transaction.provider === filter.provider
    );

  if (filter?.currency)
    transactions = transactions.filter(
      (transaction) => transaction.currency === filter.currency
    );

  if (filter?.merchant)
    transactions = transactions.filter(
      (transaction) => transaction.merchantId == filter.merchant
    );

  return await transactionCollection(transactions);
};

export let getTransactionsByMerchant = async (userId, filter) => {};

export let showTransactionByCustomer = async (userId, transactionId) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction || transaction.customerId.toString() !== userId) return null;
  return transactionResource(transaction);
};
