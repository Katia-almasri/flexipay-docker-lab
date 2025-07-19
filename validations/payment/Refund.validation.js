import Joi from "joi";
export const refundSchema = Joi.object({
  amount: Joi.number().messages({
    "number.base": "Enter a valid amount.",
  }),
});
