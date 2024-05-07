import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserLoginDto, UserRegisterDto } from './dto';
import { GetUser } from '../auth/decorator';
import { UserGuard } from '../auth/guard';
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
        return this.service.getUser(user.id);
    }

    @Get('/:id')
    @UseGuards(UserGuard)
    @ApiOperation({summary: "Get user by id"})
    getUserById(@Param('id', ParseIntPipe) user: number) {
        return this.service.getUser(user);
    }
}
