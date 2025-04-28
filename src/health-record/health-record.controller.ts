import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { HealthRecordService } from './health-record.service';
import { Request } from 'express';
import { CreateHealthRecordDto } from 'src/auth/dto/create-health-record.dto';

@Controller('health-record')
export class HealthRecordController {
    constructor(private readonly healthRecordService: HealthRecordService) {}

    @Post()
    async create(@Req() request: Request, @Body() createHealthRecordDto: CreateHealthRecordDto) {
        const userId = request['user'].userId; // Ambil ID pengguna dari request
        return this.healthRecordService.create(userId, createHealthRecordDto);
    }

    @Get()
    async findAll(@Req() request: Request) {
        const userId = request['user'].userId;
        return this.healthRecordService.findAll(userId);
    }

    @Get(':id')
    async findOne(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = request['user'].userId;
        return this.healthRecordService.findOne(userId, id);
    }

    @Patch(':id')
    async update(@Req() request: Request, @Param('id', ParseIntPipe) id: number, @Body() updateHealthRecordDto: CreateHealthRecordDto) {
        const userId = request['user'].userId;
        return this.healthRecordService.update(userId, id, updateHealthRecordDto);
    }

    @Delete(':id')
    async remove(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = request['user'].userId;
        return this.healthRecordService.remove(userId, id);
    }
}