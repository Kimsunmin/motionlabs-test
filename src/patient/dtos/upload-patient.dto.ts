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
  @ApiProperty()
  insertedCount: number;

  @ApiProperty()
  failedCount: number;
}

export class UploadPatientResponseMetaDto {
  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;
}

export class UploadPatientResponseDto {
  @ApiProperty()
  data: UploadPatientResponseDataDto;

  @ApiProperty()
  meta: UploadPatientResponseMetaDto;
}
