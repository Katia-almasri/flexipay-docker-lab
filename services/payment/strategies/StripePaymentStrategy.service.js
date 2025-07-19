import { PaymentStrategy } from "../../../abstracts/PaymentMethod.interface.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import { createTransaction } from "../Transaction.service.js";

dotenv.config();

export class StripePaymentStrategy extends PaymentStrategy {
  constructor() {
    super();
    this._stripe = new Stripe(process.env.STRIPE_SECRET);
  }

  async pay(data) {
    //1. perform the payment
    const result = await this.createStripePayment(data);
    data = {
      amount: data.amount,
      currency: data.currency,
      customerId: data.user_id,
      merchantId: data.merchantId,
      paymentIntentId: result.id,
    };
    //2. add the succeeded payment to the transaction model
    const transaction = await createTransaction(data);

    return {
      client_secret: result.client_secret,
      transaction: transaction,
    };
  }

  async refund(amount, paymentIntentId) {
    const result = await this._stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount,
    });
    return result;
  }

  async createStripePayment(data) {
    const paymentIntent = await this._stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency ?? process.env.CURRENCY,
      customer: data.customer_id,
      payment_method: data.payment_method_id,
      off_session: true,
      confirm: true,
    });
    return paymentIntent;
  }
}
