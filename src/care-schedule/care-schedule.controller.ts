import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { CareScheduleService } from './care-schedule.service';
import { Request } from 'express';
import { CreateCareScheduleDto } from 'src/auth/dto/create-care-schedule.dto';


@Controller('care-schedule')
export class CareScheduleController {
    constructor(private readonly careScheduleService: CareScheduleService) {}

    @Post()
    async create(@Req() request: Request, @Body() createCareScheduleDto: CreateCareScheduleDto) {
        const userId = request['user'].userId; // Ambil ID pengguna dari request (setelah guard)
        return this.careScheduleService.create(userId, createCareScheduleDto);
    }

    @Get()
    async findAll(@Req() request: Request) {
        const userId = request['user'].userId;
        return this.careScheduleService.findAll(userId);
    }

    @Get(':id')
    async findOne(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = request['user'].userId;
        return this.careScheduleService.findOne(userId, id);
    }

    @Patch(':id')
    async update(@Req() request: Request, @Param('id', ParseIntPipe) id: number, @Body() updateCareScheduleDto: CreateCareScheduleDto) {
        const userId = request['user'].userId;
        return this.careScheduleService.update(userId, id, updateCareScheduleDto);
    }

    @Delete(':id')
    async remove(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
        const userId = request['user'].userId;
        return this.careScheduleService.remove(userId, id);
    }
}