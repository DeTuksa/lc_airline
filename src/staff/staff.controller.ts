import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StaffRegisterDto } from './dto';
import { StaffService } from './staff.service';

@Controller('api/v1/staff')
export class StaffController {

    constructor(private service: StaffService) {}

    @ApiTags('staff')
    @Post('create-staff')
    @ApiOperation({summary: 'create staff'})
    createStaff(@Body() dto: StaffRegisterDto) {
        return this.service.createStaff(dto);
    }
}
