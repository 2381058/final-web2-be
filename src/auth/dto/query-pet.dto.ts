// src/pet/dto/query-pet.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryPetDto {
  @ApiPropertyOptional({ description: 'Filter by pet type', example: 'Dog' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Filter by pet age', example: 3 })
  @IsOptional()
  @Type(() => Number) // Ensure transformation from string query param
  @IsNumber()
  @Min(0)
  age?: number;
}