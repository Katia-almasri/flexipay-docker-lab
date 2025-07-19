import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";

dotenv.config();

const Environment =
  process.env.NODE_ENV === "production"
    ? checkoutNodeJssdk.core.LiveEnvironment
    : checkoutNodeJssdk.core.SandboxEnvironment;

export const paypalClient = () => {
  const env = new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET
  );
  return new checkoutNodeJssdk.core.PayPalHttpClient(env);
};
