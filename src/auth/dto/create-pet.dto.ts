// src/pet/dto/create-pet.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreatePetDto {
  @ApiProperty({ example: 'Fluffy', description: 'The name of the pet' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Cat', description: 'The type of the pet' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ example: 2, description: 'The age of the pet in years' })
  @IsNumber({}, { message: 'Umur harus berupa angka' }) // Pastikan ini angka
  @Min(0, { message: 'Umur tidak boleh kurang dari 0' }) // Minimal 0
  @IsNotEmpty({ message: 'Umur tidak boleh kosong' })
  @Type(() => Number) // PENTING: Untuk transformasi otomatis dari string ke number jika data datang dari form-data atau query params
  age: number;

  // Photo will be handled by file upload, not directly in DTO body
}