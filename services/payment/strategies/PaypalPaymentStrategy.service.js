import { PaymentStrategy } from "../../../abstracts/PaymentMethod.interface.js";
import { currencyTypes } from "../../../enums/CurrencyType.enum.js";
import { providerTypes } from "../../../enums/ProviderType.enum.js";
import { getAccessToken } from "../Paypal.service.js";
import { createTransaction } from "../Transaction.service.js";

import dotenv from "dotenv";

dotenv.config();

export class PaypalPaymentStrategy extends PaymentStrategy {
  constructor() {
    super();
  }

  async pay(data) {
    //1. perform the payment
    const accessToken = await getAccessToken();

    const result = await fetch(
      `${process.env.PAYPAL_API_BASE}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: data.currency ?? currencyTypes.USD,
                value: data.amount.toString(),
              },
              custom_id: accessToken,
            },
          ],
          application_context: {
            return_url: data.returnUrl,
            cancel_url: data.cancelUrl,
          },
        }),
      }
    );

    const returnedResult = await result.json();
    //2. add the succeeded payment to the transaction model
    data = {
      amount: data.amount,
      currency: data.currency,
      customerId: data.user_id,
      merchantId: data.merchantId,
      paymentIntentId: returnedResult.id,
      provider: providerTypes.PAYPAL,
    };
    const transaction = await createTransaction(data);

    if (!result.ok)
      throw new Error(`PayPal Order Create Failed: ${data.message}`);

    return {
      payment_id: returnedResult.id,
      status: returnedResult.status,
      links: returnedResult.links[1],
      transaction: transaction,
    };
  }

  async refund(amount, captureId, currency) {
    try {
      const accessToken = await getAccessToken();

      const refundUrl = `${process.env.PAYPAL_API_BASE}/v2/payments/captures/${captureId}/refund`;
      const refundPayload = amount
        ? {
            amount: {
              value: amount,
              currency_code: currency,
            },
          }
        : undefined;

      const response = await fetch(refundUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: refundPayload ? JSON.stringify(refundPayload) : null,
      });

      const refundData = await response.json();
      if (!response.ok) {
        throw new Error(refundData.details[0].description);
      }

      return refundData;
    } catch (error) {
      throw new Error("something went wrong!, please try again!");
    }
  }
}
