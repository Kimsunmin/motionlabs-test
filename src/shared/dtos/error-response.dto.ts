import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP 상태 코드',
    enum: HttpStatus,
    example: HttpStatus.BAD_REQUEST,
  })
  statusCode: HttpStatus;

  @ApiProperty({ description: '에러 메시지' })
  message: string;

  @ApiProperty({ description: '에러 이름' })
  error: string;
}
