import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user') {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('USER_JWT_SECRET')
        });
    }

    async validate(payload: {sub: number, email: string}) {

        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
                email: payload.email
            }
        });

        if (!user) throw new UnauthorizedException()
        user.password;
        return user;
    }
}