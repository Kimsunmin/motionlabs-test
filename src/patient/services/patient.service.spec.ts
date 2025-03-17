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

  it('이름, 전화번호가 같고 신규 환자의 차트번호가 없다면 새로운 환자로 등록 되어야 합니다.', () => {
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
        chartNumber: null,
        address: '서울',
        ssn: '123456-1234567',
        memo: 'memo3',
      },
    ] as Patient[];

    const result = service.deduplicatePatients(patients);

    expect(result.length).toBe(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ chartNumber: '123', memo: 'memo1' }),
        expect.objectContaining({ chartNumber: null, memo: 'memo3' }),
      ]),
    );
  });

  it('이름, 전화번호, 차트번호가 같다면 주소, 주민등록번호, 메모가 업데이트 되어야 합니다.', () => {
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
        address: '경기도',
        ssn: '123456-1******',
        memo: '없음',
      },
    ] as Patient[];

    const result = service.deduplicatePatients(patients);

    expect(result.length).toBe(1);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          chartNumber: '123',
          ssn: '123456-1******',
          address: '경기도',
          memo: '없음',
        }),
      ]),
    );
  });

  it('이름, 전화번호가 같고 기존에 차트번호가 null인 환자의 차트 번호를 업데이트 해야 합니다.', () => {
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
        phoneNumber: '01011112222',
        chartNumber: null,
        address: '서울',
        ssn: '123456-1234567',
        memo: 'memo3',
      },
      {
        name: '홍길동',
        phoneNumber: '01011112222',
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
        expect.objectContaining({ chartNumber: '123', memo: 'memo1' }),
        expect.objectContaining({ chartNumber: '456', memo: 'memo3' }),
      ]),
    );
  });

  it('차트 번호 null인 환자의 차트 번호가 업데이트 된 후 이름, 전화번호, 차트번호가 같다면 주소, 주민등록번호, 메모가 업데이트 되어야 합니다', () => {
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
        phoneNumber: '01011112222',
        chartNumber: null,
        address: '서울',
        ssn: '123456-1234567',
        memo: 'memo3',
      },
      {
        name: '홍길동',
        phoneNumber: '01011112222',
        chartNumber: '456',
        address: '서울',
        ssn: '123456-1234567',
        memo: 'memo4',
      },
      {
        name: '홍길동',
        phoneNumber: '01011112222',
        chartNumber: '456',
        address: '경기도',
        ssn: '123456-1******',
        memo: '메모',
      },
    ] as Patient[];

    const result = service.deduplicatePatients(patients);

    expect(result.length).toBe(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ chartNumber: '123', memo: 'memo1' }),
        expect.objectContaining({ chartNumber: '456', memo: '메모' }),
      ]),
    );
  });
});
