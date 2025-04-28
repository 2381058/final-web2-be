import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareSchedule } from './care-schedule.entity';
import { CareScheduleService } from './care-schedule.service';
import { CareScheduleController } from './care-schedule.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CareSchedule])],
    providers: [CareScheduleService],
    controllers: [CareScheduleController],
})
export class CareScheduleModule {}