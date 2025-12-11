import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let msg = '服务错误';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // NestJS 默认可能返回 string 或 object，需要兼容
      if (typeof exceptionResponse === 'string') {
        msg = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const r: any = exceptionResponse;
        msg = r.message || r.error || JSON.stringify(r);
      }
    } else {
      if (exception?.message) {
        msg = exception?.message;
      }

      console.error(exception);
    }

    response.status(status).json({
      code: status,
      msg,
      data: null,
    });
  }
}
