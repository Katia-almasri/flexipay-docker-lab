import { ApiError } from "./ApiError.error.js";
import { statusCode } from "../enums/common/StatusCode.enum.js";

export class BadRequestError extends ApiError {
  constructor(message = "Bad request", details = null) {
    super(statusCode.BAD_REQUEST, message, details);
  }
}
