import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthRecord } from './health-record.entity';
import { CreateHealthRecordDto } from 'src/auth/dto/create-health-record.dto';
import { HealthRecordDto } from 'src/auth/dto/health-record.dto';

@Injectable()
export class HealthRecordService {
    constructor(
        @InjectRepository(HealthRecord)
        private healthRecordRepository: Repository<HealthRecord>,
    ) {}

    async create(userId: number, createHealthRecordDto: CreateHealthRecordDto): Promise<HealthRecordDto> {
        const healthRecord = this.healthRecordRepository.create({
            user: { id: userId },
            pet: { id: createHealthRecordDto.petId },
            ...createHealthRecordDto,
        });
        const savedRecord = await this.healthRecordRepository.save(healthRecord);
        return this.mapToDto(savedRecord);
    }

    async findAll(userId: number): Promise<HealthRecordDto[]> {
        const healthRecords = await this.healthRecordRepository.find({
            where: { user: { id: userId } },
            relations: ['pet'], // Jika ingin mengambil data pet terkait
        });
        return healthRecords.map(this.mapToDto);
    }

    async findOne(userId: number, id: number): Promise<HealthRecordDto> {
        const healthRecord = await this.healthRecordRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['pet'], // Jika ingin mengambil data pet terkait
        });
        if (!healthRecord) {
            throw new NotFoundException(`Health record with ID ${id} not found`);
        }
        return this.mapToDto(healthRecord);
    }

    async update(userId: number, id: number, updateHealthRecordDto: CreateHealthRecordDto): Promise<HealthRecordDto> {
        const healthRecord = await this.findOne(userId, id);
        Object.assign(healthRecord, updateHealthRecordDto);
        const updatedRecord = await this.healthRecordRepository.save(healthRecord);
        return this.mapToDto(updatedRecord);
    }

    async remove(userId: number, id: number): Promise<void> {
        const healthRecordEntity = await this.healthRecordRepository.findOne({ where: { id } });
        if (!healthRecordEntity) {
      throw new NotFoundException(`Health record with ID ${id} not found`);
    }
    await this.healthRecordRepository.remove(healthRecordEntity);
    }

    private mapToDto(healthRecord: HealthRecord): HealthRecordDto {
        const { id, pet, issueType, description, diagnosis, treatment, recordDate, createdAt, updatedAt } = healthRecord;
        return { id, petId: pet.id, issueType, description, diagnosis, treatment, recordDate, createdAt, updatedAt };
    }
}