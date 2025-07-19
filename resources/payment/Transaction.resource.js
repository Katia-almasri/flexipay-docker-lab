import { UserResource } from "../User.resource.js";
import { User } from "../../models/user.model.js";

export let transactionResource = async (transaction) => {
  return {
    id: transaction._id,
    status: transaction.status,
    currency: transaction.currency,
    customer: UserResource(await getUserById(transaction.customerId)),
    merchant: UserResource(await getUserById(transaction.merchantId)),
    created_at: transaction.createdAt,
    updated_at: transaction.updatedAt,
  };
};

export let transactionCollection = async (transactions) => {
  return await Promise.all(
    transactions.map((transaction) => transactionResource(transaction))
  );
};

let getUserById = async (userId) => {
  return await User.findById(userId);
};
