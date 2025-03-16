import { Patient } from '@/patient/entities/patient.entity';
import configuration from '@/shared/config/configuration';
import validation from '@/shared/config/validation';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: validation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        database: configService.get<string>('database.name'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        entities: [Patient],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: true,
      }),
    }),
  ],
  exports: [ConfigModule],
})
export class SharedModule {}
