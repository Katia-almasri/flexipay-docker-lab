import { statusCode } from "../enums/common/StatusCode.enum.js";

export let validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(statusCode.UNPROCESSABLE_ENTITY).json({
        data: null,
        msg: messages,
        code: statusCode.UNPROCESSABLE_ENTITY,
      });
    }

    next();
  };
};
