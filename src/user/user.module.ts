import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserJwtStrategy } from 'src/auth/strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({})
  ],
  providers: [
    UserService,
    UserJwtStrategy
  ],
  controllers: [UserController]
})
export class UserModule {}
