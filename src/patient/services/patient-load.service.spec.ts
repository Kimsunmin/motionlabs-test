import { Test, TestingModule } from '@nestjs/testing';
import { PatientLoadService } from './patient-load.service';

describe('PatientsLoadService', () => {
  let service: PatientLoadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientLoadService],
    }).compile();

    service = module.get<PatientLoadService>(PatientLoadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('유효성 검사: 환자 이름', () => {
    it('비어있다면 false를 반환 해야 합니다.', () => {
      // Given
      const name = undefined;

      // When
      const result = service.isValidName(name);

      // Then
      expect(result).toEqual(false);
    });

    it('16자를 넘긴다면 false를 반환 해야 합니다.', () => {
      // Given
      const name = 'ztYUBQrwQhHezeLhbqsS';

      // When
      const result = service.isValidName(name);

      // Then
      expect(result).toEqual(false);
    });

    it('1~16자 사이라면 true를 반환해야 합니다.', () => {
      // Given
      const name = '김선민';

      // When
      const result = service.isValidName(name);

      // Then
      expect(result).toEqual(true);
    });
  });

  describe('유효성 검사: 전화번호', () => {
    it('비어있다면 false를 반환해야 합니다.', () => {
      // Given
      const phoneNumber = undefined;

      // When
      const result = service.isValidPhoneNumber(phoneNumber);

      // Then
      expect(result).toEqual(false);
    });

    it('문자로 되어있다면 false를 반환해야 합니다.', () => {
      // Given
      const phoneNumber = 'zxtTkrNDogE';

      // When
      const result = service.isValidPhoneNumber(phoneNumber);

      // Then
      expect(result).toEqual(false);
    });

    it('010-XXXX-XXXX과 같다면 true를 반환해야 합니다.', () => {
      // Given
      const phoneNumber = '010-1855-6059';

      // When
      const result = service.isValidPhoneNumber(phoneNumber);

      // Then
      expect(result).toEqual(true);
    });

    it('010XXXXXXXX과 같다면 true를 반환해야 합니다.', () => {
      // Given
      const phoneNumber = '01018556059';

      // When
      const result = service.isValidPhoneNumber(phoneNumber);

      // Then
      expect(result).toEqual(true);
    });
  });

  describe('유효성 검사: 주민등록번호', () => {
    it('비어있다면 false를 반환해야 합니다.', () => {
      // Given
      const ssn = undefined;

      // When
      const result = service.isValidSSN(ssn);

      // Then
      expect(result).toEqual(false);
    });

    it('생년월일이 숫자가 아니라면 false를 반환해야 합니다.', () => {
      // Given
      const ssn = 'abcdef-ghijklm';

      // When
      const result = service.isValidSSN(ssn);

      // Then
      expect(result).toEqual(false);
    });

    it('생년월일(숫자)만 존재한다면 true를 반환해야 합니다.', () => {
      // Given
      const ssn = '991228';

      // When
      const result = service.isValidSSN(ssn);

      // Then
      expect(result).toEqual(true);
    });

    it('XXXXXX-XXXXXXX(숫자 6,-,7)의 형식이라면 true를 반환해야 합니다.', () => {
      // Given
      const ssn = '991227-3375600';

      // When
      const result = service.isValidSSN(ssn);

      // Then
      expect(result).toEqual(true);
    });

    it('XXXXXXXXXXXXX(숫자)의 형식이라면 true를 반환해야 합니다.', () => {
      // Given
      const ssn = '9912273375600';

      // When
      const result = service.isValidSSN(ssn);

      // Then
      expect(result).toEqual(true);
    });

    it('이미 마스킹 되어 있다면 true를 반환해야 합니다.', () => {
      // Given
      const ssn = '990101-1******';

      // When
      const result = service.isValidSSN(ssn);

      // Then
      expect(result).toEqual(true);
    });
  });

  describe('formatPhoneNumber', () => {
    it('하이픈 문자가 존재한다면 제거된 값을 반환해야합니다.', () => {
      // Given
      const phoneNumber = '010-1111-2222';

      // When
      const result = service.formatPhoneNumber(phoneNumber);

      // Then
      expect(result).toBe('01011112222');
    });
  });

  describe('formatSSN', () => {
    it('생년월일만 존재한다면 0****** 으로 마스킹 된 값을 반환해야합니다.', () => {
      // Given
      const ssn = '980224';

      // When
      const result = service.formatSSN(ssn);

      // Then
      expect(result).toBe('980224-0******');
    });

    it('전체 주민등록번호에 하이픈이 없다면 하이픈을 포함하여 마스킹 된 값을 반환해야합니다.', () => {
      // Given
      const ssn = '9802241111111';

      // When
      const result = service.formatSSN(ssn);

      // Then
      expect(result).toBe('980224-1******');
    });

    it('주민등록번호 뒤 1자를 제외 마스킹 된 값을 반환해야합니다.', () => {
      // Given
      const ssn = '980224-1111111';

      // When
      const result = service.formatSSN(ssn);

      // Then
      expect(result).toBe('980224-1******');
    });
  });
});
