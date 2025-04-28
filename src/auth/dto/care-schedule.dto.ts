import { CareType } from "src/care-schedule/care-schedule.entity";

export class CareScheduleDto {
    id: number;
    petName: string;
    careType: CareType;
    scheduledAt: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}