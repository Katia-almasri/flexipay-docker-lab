import Joi from "joi";
import { paymentMethod } from "../../enums/PaymentMethod.enum.js";

// Common fields per provider
export const paypalCredentials = Joi.object({
  client_id: Joi.string()
    .required()
    .messages({ "any.required": "PayPal client_id is required." }),
  client_secret: Joi.string()
    .required()
    .messages({ "any.required": "PayPal client_secret is required." }),
});

export const stripeCredentials = Joi.object({
  publishable_key: Joi.string()
    .required()
    .messages({ "any.required": "Stripe publishable_key is required." }),
  secret_key: Joi.string()
    .required()
    .messages({ "any.required": "Stripe secret_key is required." }),
});

export const web3Credentials = Joi.object({
  wallet_address: Joi.string()
    .required()
    .messages({ "any.required": "Wallet address is required." }),
  network: Joi.string()
    .required()
    .messages({ "any.required": "Crypto network is required." }),
});

export const bankCredentials = Joi.object({
  account_number: Joi.string()
    .required()
    .messages({ "any.required": "Account number is required." }),
  iban: Joi.string()
    .required()
    .messages({ "any.required": "IBAN is required." }),
  swift_code: Joi.string()
    .required()
    .messages({ "any.required": "SWIFT code is required." }),
  bank_name: Joi.string().optional(),
});

// customer validation
export const storeCustomerPaymentMethodSchema = Joi.object({
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
        { is: "stripe", then: stripeCredentials.required() },
        { is: "web3", then: web3Credentials.required() },
        { is: "bank", then: bankCredentials.required() },
        { is: "paypal", then: Joi.forbidden() },
      ],
      otherwise: Joi.forbidden(),
    })
    .messages({
      "any.required": "Credentials are required for this payment method.",
    }),

  is_primary: Joi.boolean().optional(),
});

// merchant validation
export const storeMerchantPaymentMethodSchema = Joi.object({
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

  is_primary: Joi.boolean().optional(),
});
