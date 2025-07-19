import { ApiError } from "./ApiError.error.js";
import { statusCode } from "../enums/common/StatusCode.enum.js";

export class UnAuthorizedError extends ApiError {
  constructor(message = "UnAuthorized Access!", details = null) {
    super(statusCode.UNAUTHORIZED, message, details);
  }
}
