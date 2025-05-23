import { IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import { CareType } from '../care-schedule.entity';

export class CreateCareScheduleDto {
    @IsNotEmpty()
    petName: string;

    @IsEnum(CareType)
    @IsNotEmpty()
    careType: CareType;
    @IsNotEmpty()
    scheduledAt: Date;

    notes?: string;
}