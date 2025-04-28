// src/pet/dto/pet.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Pet } from 'src/pet/pet.entity';

export class PetDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  age: number;

  @ApiProperty({ nullable: true })
  photoUrl: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  // Helper method to map from entity
 static fromEntity(pet: Pet): PetDto {
    const dto = new PetDto();
    dto.id = pet.id;
    dto.name = pet.name;
    dto.type = pet.type;
    dto.age = pet.age;
    return dto;
  } 
}