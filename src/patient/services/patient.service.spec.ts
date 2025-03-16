import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from './patient.service';
import { PatientLoadService } from './patient-load.service';
import { PatientRepository } from '../repositories/patient.repository';
import { Patient } from '../entities/patient.entity';

describe('PatientService', () => {
  let service: PatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: PatientLoadService,
          useValue: {},
        },
        {
          provide: PatientRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
  });

  it('should deduplicate patients correctly', () => {
    const patients: Patient[] = [
      {
        name: '홍길동',
        phoneNumber: '01012345678',
        chartNumber: '123',
        address: '서울',
        ssn: '123456-1234567',
        memo: 'memo1',
      },
      {
        name: '홍길동',
        phoneNumber: '01012345678',
        chartNumber: '123',
        address: '서울',
        ssn: '123456-1234567',
        memo: 'memo2',
      },
      {
        name: '홍길동',
        phoneNumber: '01012345678',
        chartNumber: null,
        address: '서울',
        ssn: '123456-1234567',
        memo: 'memo3',
      },
      {
        name: '홍길동',
        phoneNumber: '01012345678',
        chartNumber: null,
        address: '서울',
        ssn: '123456-1234567',
        memo: 'memo3',
      },
      {
        name: '홍길동',
        phoneNumber: '01012345678',
        chartNumber: '456',
        address: '서울',
        ssn: '123456-1234567',
        memo: 'memo4',
      },
    ] as Patient[];

    const result = service.deduplicatePatients(patients);

    expect(result.length).toBe(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ chartNumber: '123', memo: 'memo2' }),
        expect.objectContaining({ chartNumber: '456', memo: 'memo3' }),
      ]),
    );
  });
});
