import { Patient } from '@/patient/entities/patient.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PatientRepository extends Repository<Patient> {
  constructor(private readonly dataSource: DataSource) {
    super(Patient, dataSource.createEntityManager());
  }

  async batchInsert(patients: Patient[], chunkSize = 10000): Promise<number> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let insertedCount = 0;
    try {
      for (let i = 0; i < patients.length; i += chunkSize) {
        const chunk = patients.slice(i, i + chunkSize);
        const result = await queryRunner.manager.insert(Patient, chunk);
        insertedCount += result.identifiers.length;
      }
      await queryRunner.commitTransaction();

      return insertedCount;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
