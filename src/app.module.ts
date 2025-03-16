import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SharedModule } from './shared/shared.module';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [SharedModule, PatientModule],
  controllers: [AppController],
})
export class AppModule {}
