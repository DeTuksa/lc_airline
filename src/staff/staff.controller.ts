import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StaffLoginDto, StaffRegisterDto } from './dto';
import { StaffService } from './staff.service';
import { GetUser } from '../auth/decorator';
import { Staff } from '@prisma/client';
import { StaffGuard } from '../auth/guard';

@ApiTags('staff')
@Controller('api/v1/staff')
export class StaffController {

    constructor(private service: StaffService) {}

    @Post('create-staff')
    @ApiOperation({summary: 'create staff'})
    createStaff(@Body() dto: StaffRegisterDto) {
        return this.service.createStaff(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: 'staff login'})
    login(@Body() dto: StaffLoginDto) {
        return this.service.login(dto);
    }

    @Get()
    @UseGuards(StaffGuard)
    @ApiOperation({summary: 'Get staff'})
    getStaff(@GetUser() staff: Staff) {
        return this.service.getStaff(staff.id);
    }

    @Get('/:id')
    @UseGuards(StaffGuard)
    @ApiOperation({summary: 'get staff by id'})
    getStaffById(@Param('id', ParseIntPipe) id: number) {
        return this.service.getStaff(id);
    }
}
