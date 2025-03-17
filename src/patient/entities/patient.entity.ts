import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
