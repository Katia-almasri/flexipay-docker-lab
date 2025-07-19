import Stripe from "stripe";
import dotenv from "dotenv";
import { CustomerStripe } from "../../resources/payment/stripe/CustomerStripe.resource.js";
import { User } from "../../models/user.model.js";
import { stripeEvents } from "../../enums/StripeEvent.enum.js";
import { transactionStatus } from "../../enums/TransactionStatus.enum.js";
import { updateTransactionByCriteria } from "./Transaction.service.js";
dotenv.config();

/**
 * This service is to manage the functionality of stripe, customers and methods
 */
const stripe = new Stripe(process.env.STRIPE_SECRET);

export let createCustomer = async (user) => {
  try {
    const customer = await stripe.customers.create({
      name: user.name,
      email: user.email,
      metadata: {
        userId: user._id.toString(),
      },
    });
    return CustomerStripe(customer);
  } catch (error) {
    throw new Error(error);
  }
};

export let makeDefaultStripePaymentMethod = async (userId, paymentMethodId) => {
  try {
    const user = await User.findById(userId);
    const paymentMethod = user.paymentMethods.id(paymentMethodId);
    const credentials = Object.fromEntries(paymentMethod.credentials);
    await stripe.paymentMethods.attach(credentials.payment_method_id, {
      customer: credentials.customer_id,
    });
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

export let implementWebhook = async (data, signature) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(data, signature, webhookSecret);
  } catch (err) {
    throw new Error(err.message);
  }

  switch (event.type) {
    case stripeEvents.PAYMENT_SUCCEED:
      const paymentIntent = event.data.object;
      console.log("✅ Payment succeeded:", paymentIntent.id);
      await updateTransactionByCriteria(
        { paymentIntentId: paymentIntent.id },
        { status: transactionStatus.SUCCEED }
      );
      break;

    case stripeEvents.PAYMENT_FAILED:
      const failedIntent = event.data.object;
      console.log("❌ Payment failed:", failedIntent.id);
      //TODO notify user when implement email
      break;

    case stripeEvents.CHARGE_REFUNDED:
      const refund = event.data.object;
      console.log("↩️ Charge refunded:", refund.id);
      // Update records
      await updateTransactionByCriteria(
        { paymentIntentId: refund.payment_intent },
        {
          status: transactionStatus.CHARGE_REFUNDED,
          refundedAmount: refund.amount_refunded,
        }
      );

    default:
      console.log(`📌 Unhandled event type: ${event.type}`);
  }

  // ✅ Respond to Stripe
  return { recieved: true };
};
