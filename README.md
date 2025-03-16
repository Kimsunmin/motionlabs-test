- 프로젝트 설명
- 설치 및 실행 방법
- API 문서
- 데이터베이스 스키마 설명
- 성능 최적화 방법에 대한 설명

## 프로젝트 설명

엑셀 파일을 통해 환자 정보를 등록/조회 합니다.
엑셀의 첫행은 `차트번호, 이름, 전화번호, 주민등록번호, 주소`의 형식이여야 합니다.

## 설치 및 실행 방법

### 1.설치
```bash
$ git clone https://github.com/Kimsunmin/motionlabs-test.git

# pnpm
$ pnpm install

# npm
$ npm install
```

### 2. 실행 방법

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run build
$ pnpm run start:prod
```

## API 문서

! 작성 필요

## 데이터베이스 스키마 설명
```typscript
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

  @UpdateDateColumn({ nullable: true, comment: '수정일' })
  updatedAt: Date | null;
}
```

## 성능 최적화 방법에 대한 설명
! 작성 필요

### History

```
Insert data(save-chunk-5000): 32.718ms
Insert data(save-chunk-100000): 28.718ms
Insert data(Promise-chunk-100000): 3.341s
Insert data(For-of-chunk-100000): 3.416s
```