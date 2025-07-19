import { ApiError } from "./ApiError.error.js";
import { statusCode } from "../enums/common/StatusCode.enum.js";

export class UnprocessableEntity extends ApiError {
  constructor(message = "Un Processable Entity", details = null) {
    super(statusCode.UNPROCESSABLE_ENTITY, message, details);
  }
}
