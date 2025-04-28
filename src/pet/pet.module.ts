// src/pet/pet.module.ts
import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './pet.entity';
import { AuthModule } from 'src/auth/auth.module'; // Impor AuthModule jika guard/strategi ada di sana
import { UserModule } from 'src/user/user.module'; // Mungkin diperlukan jika perlu inject UserService

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet]), // Daftarkan Pet entity
    AuthModule, // Impor jika JwtAuthGuard bergantung pada provider dari AuthModule
    // UserModule, // Uncomment jika PetService perlu inject UserService
  ],
  controllers: [PetController],
  providers: [PetService],
})
export class PetModule {}