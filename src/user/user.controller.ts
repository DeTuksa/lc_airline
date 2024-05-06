import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserLoginDto, UserRegisterDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { UserGuard } from 'src/auth/guard';
import { User } from '@prisma/client';

@ApiTags('user')
@Controller('api/v1/user')
export class UserController {
    constructor(private service: UserService) {}

    @Post('create-user')
    @ApiOperation({summary: "Create user"})
    createUser(@Body() dto: UserRegisterDto) {
        return this.service.createUser(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Login"})
    login(@Body() dto: UserLoginDto) {
        return this.service.login(dto);
    }

    @Get()
    @UseGuards(UserGuard)
    @ApiBasicAuth()
    @ApiOperation({summary: "Get user"})
    getUser(@GetUser() user: User) {
        return this.service.getUser(user);
    }
}
