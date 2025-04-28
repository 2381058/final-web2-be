import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthRecord } from './health-record.entity';
import { HealthRecordService } from './health-record.service';
import { HealthRecordController } from './health-record.controller';

@Module({
    imports: [TypeOrmModule.forFeature([HealthRecord])],
    providers: [HealthRecordService],
    controllers: [HealthRecordController],
})
export class HealthRecordModule {}