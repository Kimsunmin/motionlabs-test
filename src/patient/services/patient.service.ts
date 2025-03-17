import { NO_CHART_NUMBER } from '@/patient/constants/patient.constants';
import { GetPatientsDto } from '@/patient/dtos/get-patients.dto';
import { Patient } from '@/patient/entities/patient.entity';
import { PatientRepository } from '@/patient/repositories/patient.repository';
import { PatientLoadService } from '@/patient/services/patient-load.service';
import { PaginationQueryDto } from '@/shared/dtos/pagination-query.dto';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PatientService {
  constructor(
    private readonly patientLoadService: PatientLoadService,
    private readonly patientRespoitory: PatientRepository,
  ) {}

  async getPatients(
    query: PaginationQueryDto,
  ): Promise<{ data: Patient[]; count: number }> {
    const [patients, count] = await this.patientRespoitory.findAndCount({
      take: query.pageSize,
      skip: (query.page - 1) * query.pageSize,
      order: { id: 'ASC' },
    });

    const getPatientsDtos = plainToInstance(GetPatientsDto, patients, {
      excludeExtraneousValues: true,
    });

    return {
      data: getPatientsDtos,
      count,
    };
  }

  async uploadPatientsByExcel(file: Express.Multer.File) {
    const rows = this.patientLoadService.fromExcel(file);

    const filterPatients = this.deduplicatePatients(rows.patients);
    const insertResult =
      await this.patientRespoitory.batchInsert(filterPatients);
    const failedCount = rows.totalCount - insertResult;

    return {
      insertedCount: insertResult,
      failedCount,
      totalCount: rows.totalCount,
    };
  }

  deduplicatePatients(patients: Patient[]): Patient[] {
    const patientMap = new Map<string, Patient>();
    const noChartPatientKeyMap = new Map<string, string>();

    for (const patient of patients) {
      const { name, phoneNumber, chartNumber } = patient;
      const patientKey = `${name}|${phoneNumber}|${chartNumber ?? NO_CHART_NUMBER}`;
      const noChartKey = `${name}|${phoneNumber}`;

      if (patientMap.has(patientKey)) {
        this.updateExistingPatient(patientMap.get(patientKey), patient);
      } else {
        patientMap.set(patientKey, { ...patient });
      }

      if (!chartNumber) {
        noChartPatientKeyMap.set(noChartKey, patientKey);
      } else {
        const noChartPatientKey = noChartPatientKeyMap.get(noChartKey);

        if (noChartPatientKey && patientMap.has(noChartPatientKey)) {
          const existingPatient = patientMap.get(noChartPatientKey);
          existingPatient.chartNumber = chartNumber;

          noChartPatientKeyMap.delete(noChartKey);
          patientMap.delete(noChartPatientKey);

          patientMap.set(patientKey, { ...existingPatient });
        }
      }
    }

    return Array.from(patientMap.values());
  }

  private updateExistingPatient(existingPatient: Patient, newPatient: Patient) {
    existingPatient.address = newPatient.address ?? existingPatient.address;
    existingPatient.ssn = newPatient.ssn ?? existingPatient.address;
    existingPatient.memo = newPatient.memo ?? existingPatient.memo;
  }
}
