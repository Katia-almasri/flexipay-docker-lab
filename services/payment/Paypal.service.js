import dotenv from "dotenv";
import { updateTransactionByCriteria } from "../payment/Transaction.service.js";
import { paypalEvents } from "../../enums/PaypalEvent.enum.js";
import { transactionStatus } from "../../enums/TransactionStatus.enum.js";
dotenv.config();

export const getAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(
      `${process.env.PAYPAL_API_BASE}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }).toString(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `PayPal Auth Failed: ${data.error_description || data.error}`
      );
    }

    return data.access_token;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const captureOrder = async (orderId) => {
  const accessToken = await getAccessToken();
  const res = await fetch(
    `${process.env.PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(`PayPal Capture Failed: ${data.message}`);
  return data;
};

export let implementWebhook = async (data) => {
  try {
    const response = await fetch(
      "https://api.sandbox.paypal.com/v1/notifications/verify-webhook-signature",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
            ).toString("base64"),
        },
        body: JSON.stringify(data.verificationBody),
      }
    );

    const returnedData = await response.json();
    const event = data.body.event_type;

    if (returnedData.verification_status === "SUCCESS") {
      const eventType = event; // e.g., PAYMENT.CAPTURE.COMPLETED
      const resource = data.body?.resource;
      const captureId = resource?.id;
      const links = resource?.links || [];
      let orderId = null;

      // Extract orderId from the "up" link
      const upLink = links.find((link) => link.rel === "up");
      if (upLink && upLink.href) {
        const match1 = upLink.href.match(/\/checkout\/orders\/([A-Z0-9]+)/);
        const match2 = upLink.href.match(/\/payments\/captures\/([A-Z0-9]+)/);
        if (match1 && match1[1]) {
          orderId = match1[1];
        } else if (match2 && match2[1]) {
          orderId = match2[1];
        }
      }

      switch (eventType) {
        case paypalEvents.COMPLETED:
          console.log("✅ Payment Completed");

          await updateTransactionByCriteria(
            { paymentIntentId: orderId },
            {
              status: transactionStatus.SUCCEED,
              "providerMetadata.paypal.captureId": captureId,
            }
          );
          break;

        case paypalEvents.APPROVED:
          console.log("🟡 Payment Approved");
          await updateTransactionByCriteria(
            { paymentIntentId: resource.id },
            { status: transactionStatus.APPROVED }
          );
          break;
        case paypalEvents.REFUNDED:
          console.log("↩️ Payment Refunded");
          await updateTransactionByCriteria(
            {
              "providerMetadata.paypal.captureId": orderId,
            },
            {
              status: transactionStatus.CHARGE_REFUNDED,
              refundedAmount:
                resource.seller_payable_breakdown.net_amount.value,
            }
          );
          break;
        case paypalEvents.CANCELED:
          //TODO notify the user
          break;

        case paypalEvents.DECLINED:
          //TODO notify the user
          break;

        case paypalEvents.DENIED:
          //TODO notify the user
          break;
      }
    } else {
      throw new Error("❌ Verification failed");
    }
    return { recieved: true };
  } catch (error) {
    throw new Error(`something went wrong!, Please try again`);
  }
};
