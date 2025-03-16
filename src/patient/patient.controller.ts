import { GetPatientsResponseDto } from '@/patient/dtos/get-patients.dto';
import {
  UploadPatientRequestDto,
  UploadPatientResponseDto,
} from '@/patient/dtos/upload-patient.dto';
import { PatientService } from '@/patient/services/patient.service';
import { PaginationQueryDto } from '@/shared/dtos/pagination-query.dto';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller({
  path: 'patients',
  version: '1',
})
@ApiTags('Patients API')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @ApiOperation({
    summary: '환자 정보 전체 조회 API',
    description: '환자 정보를 전체 조회합니다.',
  })
  @ApiOkResponse({
    type: GetPatientsResponseDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getPatients(
    @Query() query: PaginationQueryDto,
  ): Promise<GetPatientsResponseDto> {
    const { data, count } = await this.patientService.getPatients(query);

    return { data, meta: { totalCount: count } };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '환자 정보 업로드 (excel)',
    description:
      '엑셀 파일을 통해 환자 정보를 업로드 합니다. <br> 이때 엑셀의 첫 행은 아래와 같아야 합니다. <br> 차트번호,이름,전화번호,주민등록번호,주소,메모',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadPatientRequestDto })
  @ApiCreatedResponse({ type: UploadPatientResponseDto })
  async uploadPatientFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ): Promise<UploadPatientResponseDto> {
    const startTime = new Date();
    const { insertedCount, totalCount, failedCount } =
      await this.patientService.loadPatientsByExcel(file);

    const endTime = new Date();
    return {
      data: {
        insertedCount,
        failedCount,
      },
      meta: {
        totalCount,
        startTime,
        endTime,
      },
    };
  }
}
