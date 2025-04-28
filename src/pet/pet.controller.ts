// src/pet/pet.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    ParseIntPipe,
    Query,
    UseInterceptors,
    UploadedFile,
    Logger,
    HttpStatus,
    HttpCode,
  } from '@nestjs/common';
  import { PetService } from './pet.service';
  import { Request } from 'express';
  import { JwtPayloadDto } from 'src/auth/dto/jwt-payload.dto';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiBody,
    ApiQuery,
  } from '@nestjs/swagger';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
import { CreatePetDto } from 'src/auth/dto/create-pet.dto';
import { UpdatePetDto } from 'src/auth/dto/update-pet.dto';
import { PetDto } from 'src/auth/dto/pet.dto';
import { QueryPetDto } from 'src/auth/dto/query-pet.dto';
  
  // Konfigurasi Multer
  export const multerOptions = {
    storage: diskStorage({
      destination: './uploads/pets', // Pastikan folder ini ada
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        // Tolak file jika bukan gambar yang diizinkan
        return callback(new Error('Only image files are allowed!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 * 5, // Batas ukuran file 5MB
    },
  };
  
  @ApiTags('Pets')
  @ApiBearerAuth() // Menandakan bahwa endpoint ini memerlukan Bearer Token
  @Controller('pets')
  export class PetController {
    private readonly logger = new Logger(PetController.name);
    constructor(private readonly petService: PetService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('photo', multerOptions)) // 'photo' adalah nama field form-data
    @ApiOperation({ summary: 'Create a new pet for the logged-in user' })
    @ApiConsumes('multipart/form-data') // Penting untuk Swagger UI file upload
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Fluffy' },
            type: { type: 'string', example: 'Cat' },
            age: { type: 'number', example: 2 },
            photo: { // Nama field file
              type: 'string',
              format: 'binary',
            },
          },
          required: ['name', 'type', 'age'], // Photo is optional on create
        },
      })
    @ApiResponse({ status: 201, description: 'The pet has been successfully created.', type: PetDto })
    @ApiResponse({ status: 400, description: 'Bad Request (e.g., validation error, invalid file type)' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async create(
      @Body() createPetDto: CreatePetDto,
      @Req() request: Request,
      @UploadedFile() photoFile?: Express.Multer.File, // Terima file yang diupload
    ): Promise<PetDto> {
      const userPayload: JwtPayloadDto = request['user'];
      // Anda mungkin perlu mengambil User entity lengkap jika service membutuhkannya
      // const user = await this.userService.findById(userPayload.userId); // Contoh
      const user = { id: userPayload.userId } as any; // Asumsi service hanya butuh ID atau Anda modifikasi service
      this.logger.log(`User ${userPayload.email} creating pet: ${JSON.stringify(createPetDto)}`);
      if (photoFile) {
          this.logger.log(`Photo uploaded: ${photoFile.filename}`);
      }
      const pet = await this.petService.create(createPetDto, user, photoFile);
      return PetDto.fromEntity(pet);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all pets for the logged-in user, with optional filters' })
    @ApiQuery({ name: 'type', required: false, type: String, description: 'Filter by pet type' })
    @ApiQuery({ name: 'age', required: false, type: Number, description: 'Filter by pet age' })
    @ApiResponse({ status: 200, description: 'List of pets retrieved successfully.', type: [PetDto] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findAll(
      @Req() request: Request,
      @Query() queryDto: QueryPetDto // Gunakan DTO untuk validasi query params
    ): Promise<PetDto[]> {
      const userPayload: JwtPayloadDto = request['user'];
      this.logger.log(`User ${userPayload.email} fetching pets with filters: ${JSON.stringify(queryDto)}`);
      const pets = await this.petService.findAll(userPayload.userId, queryDto);
      // Map entity ke DTO sebelum mengirim response
      return pets.map(pet => PetDto.fromEntity(pet));
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a specific pet by ID' })
    @ApiResponse({ status: 200, description: 'Pet details retrieved successfully.', type: PetDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden (Pet does not belong to user)' })
    @ApiResponse({ status: 404, description: 'Pet not found' })
    async findOne(
      @Param('id', ParseIntPipe) id: number,
      @Req() request: Request,
    ): Promise<PetDto> {
      const userPayload: JwtPayloadDto = request['user'];
      this.logger.log(`User ${userPayload.email} fetching pet with ID: ${id}`);
      const pet = await this.petService.findOne(id, userPayload.userId);
      return PetDto.fromEntity(pet);
    }
  
    @Patch(':id')
    @UseInterceptors(FileInterceptor('photo', multerOptions))
    @ApiOperation({ summary: 'Update a specific pet by ID' })
    @ApiConsumes('multipart/form-data') // Bisa juga application/json jika tidak ada file
     @ApiBody({
        description: 'Pet data to update. Include the "photo" field only if you want to update the image.',
        required: false, // Body is optional in PATCH
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Fluffy II', nullable: true },
            type: { type: 'string', example: 'Dog', nullable: true },
            age: { type: 'number', example: 3, nullable: true },
            photo: { // Nama field file
              type: 'string',
              format: 'binary',
              nullable: true,
            },
          },
        },
      })
    @ApiResponse({ status: 200, description: 'Pet updated successfully.', type: PetDto })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Pet not found' })
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updatePetDto: UpdatePetDto,
      @Req() request: Request,
      @UploadedFile() photoFile?: Express.Multer.File,
    ): Promise<PetDto> {
      const userPayload: JwtPayloadDto = request['user'];
       this.logger.log(`User ${userPayload.email} updating pet ${id} with data: ${JSON.stringify(updatePetDto)}`);
        if (photoFile) {
          this.logger.log(`New photo uploaded for pet ${id}: ${photoFile.filename}`);
      }
      const updatedPet = await this.petService.update(id, updatePetDto, userPayload.userId, photoFile);
      return PetDto.fromEntity(updatedPet);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a specific pet by ID' })
    @ApiResponse({ status: 204, description: 'Pet deleted successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Pet not found' })
    @HttpCode(HttpStatus.NO_CONTENT) // Return 204 No Content on successful deletion
    async remove(
      @Param('id', ParseIntPipe) id: number,
      @Req() request: Request,
    ): Promise<void> {
      const userPayload: JwtPayloadDto = request['user'];
      this.logger.log(`User ${userPayload.email} deleting pet with ID: ${id}`);
      await this.petService.remove(id, userPayload.userId);
      // Tidak ada return body untuk DELETE sukses
    }
  }