import { ApiError } from "./ApiError.error.js";
import { statusCode } from "../enums/common/StatusCode.enum.js";

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden!", details = null) {
    super(statusCode.FORBIDDEN, message, details);
  }
}
