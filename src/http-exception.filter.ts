import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let message: string;

    // If it's string → use it
    if (typeof errorResponse === 'string') {
      message = errorResponse;
    }
    // If it's an object → safely check for "message"
    else if (
      typeof errorResponse === 'object' &&
      errorResponse !== null &&
      'message' in errorResponse
    ) {
      const extracted = (errorResponse as any).message;
      message = Array.isArray(extracted) ? extracted[0] : extracted;
    } else {
      message = 'An error occurred';
    }

    response.status(status).json({
      success: false,
      message,
      data: null,
    });
  }
}
