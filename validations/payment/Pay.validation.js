import Joi from "joi";
import { currencyTypes } from "../../enums/CurrencyType.enum.js";

export const paySchema = Joi.object({
  amount: Joi.number().required().messages({
    "any.required": "Amount is required.",
    "number.base": "Enter a valid amount.",
  }),

  merchant_id: Joi.string().required().messages({
    "string.empty": "merchant_id cannot be empty.",
  }),

  currency: Joi.string()
    .valid(...Object.values(currencyTypes))
    .messages({
      "any.only": `Currency must be one of: ${Object.values(currencyTypes).join(
        ", "
      )}`,
    }),

  return_url: Joi.string().optional(),

  cancel_url: Joi.string().optional(),
});
