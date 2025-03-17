import { ErrorResponseDto } from '@/shared/dtos/error-response.dto';
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
    const json: ErrorResponseDto = {
      statusCode: status,
      message: exception.message,
      error: exception.name,
    };

    response.status(status).json(json);
  }
}
