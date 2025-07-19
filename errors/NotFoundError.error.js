import { ApiError } from "./ApiError.error.js";
import { statusCode } from "../enums/common/StatusCode.enum.js";

export class NotFoundError extends ApiError {
  constructor(message = "Not found", details = null) {
    super(statusCode.NOT_FOUND, message, details);
  }
}
