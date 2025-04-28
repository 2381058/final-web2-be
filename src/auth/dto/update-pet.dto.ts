// src/pet/dto/update-pet.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdatePetDto {
  @ApiPropertyOptional({ example: 'Fluffy II', description: 'The updated name of the pet' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Dog', description: 'The updated type of the pet' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 3, description: 'The updated age of the pet' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  age?: number;

  // Photo update could be handled separately or within the same endpoint
}