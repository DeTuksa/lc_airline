import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserLoginDto, UserRegisterDto, UserResponse } from './dto';
import * as argon from 'argon2';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
        private jwt: JwtService
    ) {}

    async createUser(dto: UserRegisterDto): Promise<UserResponse> {
        const password = await argon.hash(dto.password, {saltLength: 12});
        dto.password = password;

        const userExist = await this.prisma.user.findUnique({
            where: {email: dto.email}
        });
        if(userExist) throw new ForbiddenException("Email address already taken");

        try {
            const user = await this.prisma.user.create({
                data: {
                    ...dto
                }
            });

            delete user.password;

            const token = await this.createToken(user.id, user.email);

            const response = new UserResponse();
            response.user = user;
            response.token = token;

            return response;
        } catch(error) {
            throw error;
        }
    }

    async login(dto: UserLoginDto): Promise<UserResponse> {
        try {
            const user = await this.prisma.user.findUnique({
                where: {email: dto.email}
            });

            if (!user) throw new NotFoundException("User does not exist");

            const pwMatches = await argon.verify(user.password, dto.password, {saltLength: 12});

            if (!pwMatches) throw new BadRequestException("Incorrect email or password");

            delete user.password;

            const token = await this.createToken(user.id, user.email);

            const response = new UserResponse();
            response.user = user;
            response.token = token;

            return response;
        } catch(error) {
            throw error;
        }
    }

    async getUser(user: number) {
        try {
            const userExist = await this.prisma.user.findUnique({
                where: {id: user},
                include: {
                    booking: true
                }
            });

            if(!userExist) throw new NotFoundException("User does not exist");
            delete userExist.password;

            return {
                message: "User retrieved successfully",
                status: true,
                user: userExist
            }
        } catch(error) {
            throw error;
        }
    }

    createToken(
        userId: number,
        email: string
    ): Promise<string> {
        const payload = {
            sub: userId,
            email
        };

        const secret = this.config.get('USER_JWT_SECRET')

        return this.jwt.signAsync(payload, {
            secret,       
        });
    }
}
