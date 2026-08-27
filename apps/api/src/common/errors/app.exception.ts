import { HttpException, HttpStatus } from "@nestjs/common";

import { ErrorCode } from "./error-codes.js";

export class AppException extends HttpException {
  constructor(code: ErrorCode, message: string, status: HttpStatus) {
    super(
      {
        error: {
          code,
          message,
        },
      },
      status,
    );
  }
}
