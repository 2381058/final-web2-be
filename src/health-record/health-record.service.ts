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
        const healthRecord = await this.healthRecordRepository.findOne({
            where: {
                id: id, // ID dari HealthRecord itu sendiri
                user: { // Nama properti relasi di HealthRecord entity
                    id: userId // ID dari User yang dicari
                }
            },
            relations: ['pet'],   // <-- INI YANG DITAMBAHKAN/DIPASTIKAN ADA
        });

        // 2. Periksa apakah record ditemukan
        if (!healthRecord) {
            throw new NotFoundException(`Catatan Kesehatan dengan ID ${id} tidak ditemukan untuk user ${userId}`);
        }

        // 3. Gabungkan (Merge) perubahan dari DTO ke entity yang ada
        //    Ini lebih aman daripada Object.assign, terutama jika DTO punya properti
        //    yang tidak seharusnya langsung ditimpa ke entity (seperti petId).
        this.healthRecordRepository.merge(healthRecord, updateHealthRecordDto);
        // Pastikan DTO Anda (CreateHealthRecordDto) hanya berisi field yang relevan
        // untuk diupdate di tabel health_records.

        // 4. Simpan perubahan ke database
        const updatedRecord = await this.healthRecordRepository.save(healthRecord);
        // Hasil save ('updatedRecord') akan berisi data yang sudah diperbarui
        // dan seharusnya tetap memiliki relasi 'pet' yang sudah dimuat.

        // 5. Panggil mapToDto dengan data yang sudah lengkap (termasuk relasi pet)
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

        if (!pet) {
             // Ini seharusnya tidak terjadi lagi setelah perbaikan di 'update'
             console.error(`Relasi Pet tidak dimuat saat mapping HealthRecord ID: ${id}`);
             throw new Error('Terjadi kesalahan internal: Detail pet tidak dapat dimuat.');
        }

        return {
            id,
            petId: pet.id, // Ini seharusnya aman sekarang
            issueType,
            description,
            diagnosis,
            treatment,
            recordDate,
            createdAt,
            updatedAt
        };
    }
}