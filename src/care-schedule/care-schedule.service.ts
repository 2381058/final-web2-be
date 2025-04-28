import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareSchedule } from './care-schedule.entity';
import { CareScheduleDto } from 'src/auth/dto/care-schedule.dto';
import { CreateCareScheduleDto } from 'src/auth/dto/create-care-schedule.dto';

@Injectable()
export class CareScheduleService {
    constructor(
        @InjectRepository(CareSchedule)
        private careScheduleRepository: Repository<CareSchedule>,
    ) {}

    async create(userId: number, createCareScheduleDto: CreateCareScheduleDto): Promise<CareScheduleDto> {
        const careSchedule = this.careScheduleRepository.create({
            user: { id: userId },
            ...createCareScheduleDto,
        });
        const savedSchedule = await this.careScheduleRepository.save(careSchedule);
        return this.mapToDto(savedSchedule);
    }

    async findAll(userId: number): Promise<CareScheduleDto[]> {
        const careSchedules = await this.careScheduleRepository.find({
            where: { user: { id: userId } },
        });
        return careSchedules.map(this.mapToDto);
    }

    async findOne(userId: number, id: number): Promise<CareScheduleDto> {
        const careSchedule = await this.careScheduleRepository.findOne({
            where: { id, user: { id: userId } },
        });
        if (!careSchedule) {
            throw new NotFoundException(`Care schedule with ID ${id} not found`);
        }
        return this.mapToDto(careSchedule);
    }

    async update(userId: number, id: number, updateCareScheduleDto: CreateCareScheduleDto): Promise<CareScheduleDto> {
        const careSchedule = await this.findOne(userId, id);
        Object.assign(careSchedule, updateCareScheduleDto);
        const updatedSchedule = await this.careScheduleRepository.save(careSchedule);
        return this.mapToDto(updatedSchedule);
    }

    async remove(userId: number, id: number): Promise<void> {
        const careScheduleEntity = await this.careScheduleRepository.findOne({ where: { id: id } }); // Or findOneOrFail
    if (!careScheduleEntity) {
    throw new NotFoundException(`Care schedule with ID ${id} not found`);
    }
        await this.careScheduleRepository.remove(careScheduleEntity);
    }

    private mapToDto(careSchedule: CareSchedule): CareScheduleDto {
        const { id, petName, careType, scheduledAt, notes, createdAt, updatedAt } = careSchedule;
        return { id, petName, careType, scheduledAt, notes, createdAt, updatedAt };
    }
}