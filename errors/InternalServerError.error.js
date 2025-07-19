import { ApiError } from "./ApiError.error.js";
import { statusCode } from "../enums/common/StatusCode.enum.js";

export class InternalServerError extends ApiError {
  constructor(message = "Internal Server Error", details = null) {
    super(statusCode.INTERNAL_SERVER_ERROR, message, details);
  }
}
