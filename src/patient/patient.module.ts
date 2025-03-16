import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { SharedModule } from '@/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '@/patient/entities/patient.entity';
import { PatientLoadService } from '@/patient/services/patient-load.service';
import { PatientService } from '@/patient/services/patient.service';
import { PatientRepository } from '@/patient/repositories/patient.repository';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Patient])],
  providers: [PatientService, PatientLoadService, PatientRepository],
  controllers: [PatientController],
})
export class PatientModule {}
