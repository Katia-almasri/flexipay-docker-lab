import Joi from "joi";
export const resetPasswordSchema = Joi.object({
  old_password: Joi.string().required().messages({
    "string.empty": "old password is required.",
  }),

  new_password: Joi.string().required().messages({
    "string.empty": "new password is required.",
    "string.min": "Password must be at least 6 characters long.",
  }),
});
