import Joi from "joi";
import { paymentMethod } from "../../enums/PaymentMethod.enum.js";
import {
  paypalCredentials,
  stripeCredentials,
  web3Credentials,
  bankCredentials,
} from "./StorePaymentMethod.validation.js";

// main validation
export const updatePaymentMethodSchema = Joi.object({
  type: Joi.string()
    .required()
    .valid(...Object.values(paymentMethod))
    .messages({
      "any.required": "Type is required.",
      "any.only": `Type must be one of: ${Object.values(paymentMethod)}.`,
      "string.empty": "Type cannot be empty.",
    }),

  credentials: Joi.alternatives()
    .conditional("type", {
      switch: [
        { is: "paypal", then: paypalCredentials },
        { is: "stripe", then: stripeCredentials },
        { is: "web3", then: web3Credentials },
        { is: "bank", then: bankCredentials },
      ],
      otherwise: Joi.forbidden(),
    })
    .required()
    .messages({ "any.required": "Credentials are required." }),
});
