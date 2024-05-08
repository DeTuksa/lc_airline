import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseEnumPipe, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { FlightClass, PerformanceService } from './performance.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePerfomanceDto } from './dto';
import { Staff, User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { StaffGuard, UserGuard } from '../auth/guard';

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

    @Get('/available')
    @ApiOperation({summary: 'Fetch available performance'})
    getAvailablePerformance() {
        return this.service.getPerformances();
    }

    @Get('/performances/:id')
    @UseGuards(StaffGuard)
    @ApiOperation({summary: 'Fetch available performance by staff Id'})
    getStaffPerformances(
        @Param('id', ParseIntPipe)id: number
    ) {
        return this.service.getPerformanceByStaff(id);
    }

    @Get('/performances/')
    @UseGuards(StaffGuard)
    @ApiOperation({summary: 'Fetch available performance by staff Id'})
    getCreatedPerformances(
        @GetUser()staff: Staff
    ) {
        return this.service.getPerformanceByStaff(staff.id);
    }

    @Post('book')
    @HttpCode(HttpStatus.OK)
    @UseGuards(UserGuard)
    @ApiOperation({summary: 'Book a performance'})
    bookPerformance(
        @GetUser() user: User,
        @Query('id', ParseIntPipe) id: number,
        @Query('flightClass', new ParseEnumPipe(FlightClass)) flightClass: FlightClass,
        @Query('noOfSeats', ParseIntPipe)noOfSeats: number
    ) {
        return this.service.bookFlight(user, id, flightClass, noOfSeats);
    }
}
