import { statusCode } from "../enums/common/StatusCode.enum.js";
import { ApiError } from "../errors/ApiError.error.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      data: err.details,
      msg: err.message,
      code: err.statusCode,
    });
  }

  console.error("Unexpected error! ", err);
  return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
    data: err.details,
    msg: err.message,
    code: statusCode.INTERNAL_SERVER_ERROR,
  });
}
