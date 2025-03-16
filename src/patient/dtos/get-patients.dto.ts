import { PaginationMetaDto } from '@/shared/dtos/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetPatientsDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  phoneNumber: string;

  @Expose()
  @ApiProperty()
  chartNumber?: string;

  @Expose()
  @ApiProperty()
  ssn: string;

  @Expose()
  @ApiProperty()
  memo?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetPatientsResponseDto {
  @ApiProperty({ isArray: true, type: GetPatientsDto })
  data: GetPatientsDto[];

  @ApiProperty()
  meta: PaginationMetaDto;
}
