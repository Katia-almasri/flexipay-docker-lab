import { roles } from "../../enums/userRole.enum.js";
import Joi from "joi";

export const merchantBankCredentials = Joi.object({
  account_holder_name: Joi.string().required().min(1).messages({
    "any.required": "Account holder name is required.",
    "string.empty": "Account holder name cannot be empty.",
  }),

  iban: Joi.string().required().min(1).messages({
    "any.required": "IBAN is required.",
    "string.empty": "IBAN cannot be empty.",
  }),

  swift: Joi.string().required().min(1).messages({
    "any.required": "SWIFT is required.",
    "string.empty": "SWIFT cannot be empty.",
  }),

  acount_number: Joi.string().required().min(1).messages({
    "any.required": "Account number is required.",
    "string.empty": "Account number cannot be empty.",
  }),
});

export const RegisterUserSchema = Joi.object({
  role: Joi.string()
    .required()
    .valid(...Object.values(roles))
    .messages({
      "any.required": "Role is required.",
      "any.only": `Role must be one of: ${Object.values(roles)}.`,
      "string.empty": "Role cannot be empty.",
    }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be valid.",
  }),

  username: Joi.string().required().messages({
    "string.empty": "Username is required.",
    "string.email": "Username must be valid.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
  }),

  credentials: Joi.alternatives().conditional("role", {
    is: "merchant",
    then: merchantBankCredentials.required().messages({
      "any.required": "Merchant credentials are required.",
    }),
    otherwise: Joi.forbidden(),
  }),
});
