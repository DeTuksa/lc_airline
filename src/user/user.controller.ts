import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto';

@ApiTags('user')
@Controller('api/v1/user')
export class UserController {
    constructor(private service: UserService) {}

    @Post('create-user')
    @ApiOperation({summary: "Create user"})
    createUser(@Body() dto: UserRegisterDto) {
        return this.service.createUser(dto);
    }
}
