import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StaffLoginDto, StaffRegisterDto } from './dto';
import { StaffService } from './staff.service';

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
    @ApiOperation({summary: 'staff login'})
    login(@Body() dto: StaffLoginDto) {
        return this.service.login(dto);
    }
}
