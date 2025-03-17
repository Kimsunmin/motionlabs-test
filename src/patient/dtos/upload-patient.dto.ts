import { ApiProperty } from '@nestjs/swagger';
import { IsMimeType, IsNotEmpty } from 'class-validator';

export class UploadPatientRequestDto {
  @ApiProperty({
    type: String,
    format: 'binary',
    description: '환자 정보 엑셀 파일',
  })
  @IsNotEmpty()
  @IsMimeType({
    groups: [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ],
  })
  file: Express.Multer.File;
}

export class UploadPatientResponseDataDto {
  @ApiProperty({ description: '적재 건수' })
  insertedCount: number;

  @ApiProperty({ description: '적재 실패 건수' })
  failedCount: number;
}

export class UploadPatientResponseMetaDto {
  @ApiProperty({ description: '총 건수' })
  totalCount: number;

  @ApiProperty({ description: '적재 시간 시간' })
  startTime: Date;

  @ApiProperty({ description: '적재 완료 시간' })
  endTime: Date;
}

export class UploadPatientResponseDto {
  @ApiProperty({ description: '환자 정보 일괄 등록 응답' })
  data: UploadPatientResponseDataDto;

  @ApiProperty({ description: '응답 메타 정보' })
  meta: UploadPatientResponseMetaDto;
}
