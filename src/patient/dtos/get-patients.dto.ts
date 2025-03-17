import { PaginationMetaDto } from '@/shared/dtos/pagination-query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetPatientsDto {
  @Expose()
  @ApiProperty({ description: '고유 ID' })
  id: number;

  @Expose()
  @ApiProperty({ description: '이름' })
  name: string;

  @Expose()
  @ApiProperty({ description: '전화 번호' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ description: '차트 번호', nullable: true })
  chartNumber?: string;

  @Expose()
  @ApiProperty({ description: '마스킹된 주민등록번호' })
  ssn: string;

  @Expose()
  @ApiProperty({ description: '메모', nullable: true })
  memo?: string;

  @Expose()
  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: '수정일' })
  updatedAt: Date;
}

export class GetPatientsResponseDto {
  @ApiProperty({
    description: '환자 목록 응답 데이터',
    isArray: true,
    type: GetPatientsDto,
  })
  data: GetPatientsDto[];

  @ApiProperty({
    description: '페이지네이션 메타 데이터',
  })
  meta: PaginationMetaDto;
}
