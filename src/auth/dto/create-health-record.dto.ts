import { IsNotEmpty, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { HealthIssueType } from 'src/health-record/health-record.entity';

export class CreateHealthRecordDto {
    @IsNotEmpty()
    petId: number; // ID hewan peliharaan

    @IsEnum(HealthIssueType)
    @IsNotEmpty()
    issueType: HealthIssueType;

    @IsNotEmpty()
    description: string;

    @IsOptional()
    diagnosis?: string;

    @IsOptional()
    treatment?: string;

    @IsNotEmpty()
    recordDate: Date;
}