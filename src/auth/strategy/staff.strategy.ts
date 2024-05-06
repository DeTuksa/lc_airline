import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class StaffJwtStrategy extends PassportStrategy(Strategy, 'user') {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('STAFF_JWT_SECRET')
        });
    }

    async validate(payload: {sub: number, email: string}) {

        const staff = await this.prisma.staff.findUnique({
            where: {
                id: payload.sub,
                email: payload.email
            }
        });

        if (!staff) throw new UnauthorizedException()
        staff.password;
        return staff;
    }
}