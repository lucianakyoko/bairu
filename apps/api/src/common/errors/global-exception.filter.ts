import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import { AppException } from "./app.exception.js";
import { ErrorCode } from "./error-codes.js";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof AppException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        error: {
          code: this.getHttpErrorCode(exception),
          message: this.getHttpErrorMessage(exception),
        },
      });
      return;
    }

    console.error(exception);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal server error.",
      },
    });
  }

  private getHttpErrorCode(exception: HttpException): string {
    const status = exception.getStatus();

    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return "BAD_REQUEST";

      case HttpStatus.UNAUTHORIZED:
        return "UNAUTHORIZED";

      case HttpStatus.FORBIDDEN:
        return "FORBIDDEN";

      case HttpStatus.NOT_FOUND:
        return "NOT_FOUND";

      case HttpStatus.CONFLICT:
        return "CONFLICT";

      default:
        return `HTTP_${status}`;
    }
  }

  private getHttpErrorMessage(exception: HttpException): string {
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === "string") {
      return exceptionResponse;
    }

    if (
      typeof exceptionResponse === "object" &&
      exceptionResponse !== null &&
      "message" in exceptionResponse
    ) {
      const message = exceptionResponse.message;

      if (typeof message === "string") {
        return message;
      }

      if (Array.isArray(message)) {
        return message.join(", ");
      }
    }

    return exception.message;
  }
}
