import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { StaffRegisterDto, StaffResponseDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class StaffService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {}

    async createStaff(dto: StaffRegisterDto): Promise<StaffResponseDto> {
        const password = await argon.hash(dto.password, {saltLength: 12});
        dto.password = password;
        const staff = await this.prisma.staff.findUnique({
            where: {email: dto.email}
        });

        if(staff) throw new ForbiddenException("Account with this email already exiss");

        try {
            const staff = await this.prisma.staff.create({
                data: {
                    ...dto
                }
            });

            delete staff.password;

            const token = await this.createToken(staff.id, staff.email);
            const response = new StaffResponseDto();
            response.staff = staff;
            response.token = token;
            
            return response;
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

        const secret = this.config.get('STAFF_JWT_SECRET')

        return this.jwt.signAsync(payload, {
            secret,       
        });
    }
}
