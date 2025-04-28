import { HealthIssueType } from "src/health-record/health-record.entity";

export class HealthRecordDto {
    id: number;
    petId: number;
    issueType: HealthIssueType;
    description: string;
    diagnosis?: string;
    treatment?: string;
    recordDate: Date;
    createdAt: Date;
    updatedAt: Date;
}