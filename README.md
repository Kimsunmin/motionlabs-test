## 1. 프로젝트 설명

엑셀 파일을 통해 환자 정보를 등록/조회 합니다.
엑셀의 첫행은 `차트번호, 이름, 전화번호, 주민등록번호, 주소`의 형식이여야 합니다.

## 2. 설치 및 실행 방법

### 2.1. 설치
``` bash
$ git clone https://github.com/Kimsunmin/motionlabs-test.git

# pnpm
$ pnpm install

# npm
$ npm install
```
### 2.2. env 수정
프로젝트 내에 `.env.template`를 `.env`으로 복사해 환경에 맞게 수정합니다.
``` env
# API App
PORT=3000 # 사용할 포트 번호

# Database
DB_HOST=localhost # 사용할 데이터베이스 Host
DB_PORT=3306 # 사용할 데이터베이스 port
DB_NAME=database_name # 사용할 데이터베이스명
DB_USERNAME=user # 데이터베이스 접속 유저
DB_PASSWORD=password # 접속 유저 패스워드
```

### 2.3. 실행 방법

``` bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run build
$ pnpm run start:prod
```
* swagger 문서
  > http://localhost:3000/swagger

## 3. API 명세

#### 환자 목록 조회

*   **Endpoint:** `GET /v1/patients`
*   **설명:** 등록된 환자 목록을 조회합니다.
*   **요청 쿼리 파라미터:**
    *   `page` (number, optional, 기본값: 1): 페이지 번호.
    *   `pageSize` (number, optional, 기본값: 10): 페이지당 환자 수.
*   **응답 (성공 시 200 OK):**

    ```json
    {
      "data": [
        {
          "id": 1,
          "name": "홍길동",
          "phoneNumber": "01012345678",
          "chartNumber": "12345",
          "ssn": "XXXXXX-XXXXXXX",
          "address": "서울시 강남구",
          "memo": "특이사항 없음",
          "createdAt": "2023-12-27T10:00:00.000Z",
          "updatedAt": "2023-12-27T12:00:00.000Z"
        },
        // ... 추가 환자 정보 ...
      ],
      "meta": {
        "totalCount": 100 // 전체 환자 수
      }
    }
    ```
*   **응답 (실패시):**
    *   **400 Bad Request**: 잘못된 요청 쿼리 파라미터가 있을 경우
    *   **422 Unprocessable Entity**: 데이터베이스 오류

#### 환자 정보 일괄 등록 (엑셀 업로드)

*   **Endpoint:** `POST /v1/patients/upload`
*   **설명:** 엑셀 파일을 업로드하여 환자 정보를 일괄 등록합니다.
*   **요청 Content-Type:** `multipart/form-data`
*   **요청 바디 (multipart/form-data):**
    *   `file` (file, required): 환자 정보가 담긴 엑셀 파일 (.xlsx 형식).
    *   **엑셀 파일 형식**: 첫번째 행은 `차트번호,이름,전화번호,주민등록번호,주소,메모` 순서의 컬럼명을 가져야합니다.
*   **응답 (성공 시 201 Created):**

    ```json
    {
      "data": {
        "insertedCount": 95, // 성공적으로 삽입된 환자 수
        "failedCount": 5     // 삽입에 실패한 환자 수
      },
      "meta": {
        "totalCount": 100,   // 엑셀 파일의 총 환자 수
        "startTime": "2023-12-27T10:00:00.000Z", // 작업 시작 시간
        "endTime": "2023-12-27T10:00:05.000Z"    // 작업 종료 시간
      }
    }
    ```
* **응답 (실패시)**
    * **422 Unprocessable Entity**: 파일 형식이 `.xlsx`가 아닌 경우.
    * **422 Unprocessable Entity**: 엑셀 시트 내에 헤더행 유료성 검사 실패

## 4. 데이터베이스 스키마 설명
``` typescript
@Entity({ name: 'patients' })
export class Patient {
  @PrimaryGeneratedColumn({ comment: '고유 ID' })
  id: number;

  @Column({ length: 16, comment: '이름' })
  name: string;

  @Column({ length: 11, comment: '전화번호' })
  phoneNumber: string;

  @Column({ nullable: true, comment: '차트 번호' })
  chartNumber?: string;

  @Column({ length: 15, comment: '마스킹된 주민등록번호' })
  ssn: string;

  @Column({ nullable: true, comment: '주소' })
  address?: string;

  @Column({ nullable: true, comment: '메모' })
  memo?: string;

  @CreateDateColumn({ comment: '생성일' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정일' })
  updatedAt: Date;
}
```

## 5. 성능 최적화 방법에 대한 설명
### 5.1 중복 데이터 제거 (Map 사용)
> `src/patient/services/patient.service.ts > deduplicatePatients()` 참조
1. 초기화
   * `patientMap`: 환자 정보를 저장하는 `Map`객체, 키는 `이름`,`전화번호`,`차트번호`로 구성
   * `noChartPatientMap`: 차트 번화가 없는 환자를 저장하는 `Map`객체, 키는 `이름`,`전화번호`로 구성
     
2. 환자 정보 배열 순회
   * `patients` 배열을 순회, `이름`,`전화번호`,`차트번호` 추출 및 키 생성
   * `patientKey`: 환자 구분 키, `이름`,`전화번호`,`차트번호`로 구성되며 차트번호가 없다면 `NO_CHART_NUMBER`를 사용
   * `noChartKey`: 차트 번호가 없는 환자 구분키, `이름`,`전화번호`로 구성

3. 환자 정보 처리
   * 중복 환자 처리
     * `patientMap`에 `patientKey`가 존재 하는 경우 기존 환자 정보 업데이트
     * `patientMap`에 `patientKey`가 존재 하지 않는 경우, `patientMap`에 환자 정보 추가
   * 차트 번호 처리
     * 차트 번호가 없는 경우, `noChartPatientMap`에 Key: `noChartKey`, Value: `patientKey` 추가
     * 차트 번호가 있는 경우, `noChartPatientMap`에서 `noChartKey` 해당하는 `noChartPatientKey` 조회
     * `noChartPatientKey`가 존재하고 `patientMap`에 `noChartPatientKey`가 존재하는 경우 기존 환자의 차트 번호를 업데이트, `noChartPatientKey`,`patientMap`에서 해당 정보 제거
     * 업데이트 된 정보를 `patientMap`에 저장
    
### 5.2 DB 적재 성능 최적화
> `src/patient/repositories/patient.repository.ts > batchInsert()` 참조
1. 데이터 청크 단위 삽입
   * 저장할 환자 정보 데이터를 `chunkSize` 단위로 나누어 적재
   * 적재시 `save()`가 아닌 `insert()`를 활용해 bulk insert 적재 효율 증가
   
2. 트랜잭션 적용
   * TypeOrm의 `queryRunner`를 이용해 나눈 데이터의 모든 퀴리가 정상 작동시 commit


#### 적재 방식 별 소요 시간 기록
> MacBook Pro 14 M2 pro 16GB 기준
  * save() 함수, chunk 옵션(5000) : 32.718s
  * save() 함수, chunk 옵션(10000) : 28.718s
  * Promise.All(), chunk 10000 : 3.341s
  * for(), chunk 10000: 3.416s
