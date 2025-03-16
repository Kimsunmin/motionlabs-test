import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: '페이지 사이즈',
    type: Number,
    default: 100,
  })
  @IsNumber()
  @IsOptional()
  @Max(1000)
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  pageSize = 100;

  @ApiPropertyOptional({
    description: '페이지 번호',
    type: Number,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  page = 1;
}

export class PaginationMetaDto {
  @ApiProperty()
  totalCount: number;
}
