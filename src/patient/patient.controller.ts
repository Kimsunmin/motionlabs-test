import { GetPatientsResponseDto } from '@/patient/dtos/get-patients.dto';
import {
  UploadPatientRequestDto,
  UploadPatientResponseDto,
} from '@/patient/dtos/upload-patient.dto';
import { PatientService } from '@/patient/services/patient.service';
import { ErrorResponseDto } from '@/shared/dtos/error-response.dto';
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
  ApiResponse,
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
    summary: '환자 목록 조회',
    description: '등록된 환자 목록을 조회합니다.',
  })
  @ApiOkResponse({
    type: GetPatientsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Query 파라미터 유효성 검사 실패',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 422,
    description: '데이터베이스 테이블을 찾지 못함',
    type: ErrorResponseDto,
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
    summary: '환자 정보 일괄 등록 (엑셀 업로드)',
    description:
      '엑셀 파일을 업로드하여 환자 정보를 일괄 등록합니다. <br><br> 이때 엑셀의 첫 행은 아래와 같아야 합니다. <br> 차트번호,이름,전화번호,주민등록번호,주소,메모',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadPatientRequestDto })
  @ApiCreatedResponse({ type: UploadPatientResponseDto })
  @ApiResponse({
    status: 422,
    description: '엑셀 시트 헤더 유효성 검사 실패',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 422,
    description: '엑셀 파일 확장자 유효성 검사 실패',
    type: ErrorResponseDto,
  })
  async uploadPatientsByFile(
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
      await this.patientService.uploadPatientsByExcel(file);

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
