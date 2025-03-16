import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeOrmFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const status = HttpStatus.UNPROCESSABLE_ENTITY;
    const json = {
      message: exception.message,
      error: exception.name,
      statusCode: status,
    };

    response.status(status).json(json);
  }
}
