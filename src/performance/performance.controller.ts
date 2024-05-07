import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AircraftType } from './infrastructure';
import { CreatePerfomanceDto } from './dto';
import { Staff } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { StaffGuard } from 'src/auth/guard';

@ApiTags('performance')
@Controller('api/v1/performance')
export class PerformanceController {
    constructor(private service: PerformanceService) {}

    @Get('available-aircrafts')
    @ApiOperation({summary: 'Fetch available aircrafts'})
    getAvailableAircrafts() {
        return this.service.fetchFlights();
    }

    @Post('create')
    @UseGuards(StaffGuard)
    @ApiOperation({summary: 'Create a new performance'})
    createPerformance(
        @GetUser() staff: Staff,
        @Body()dto: CreatePerfomanceDto) {
            return this.service.createPerformance(staff, dto);
        }
}
