import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { StaffJwtStrategy } from 'src/auth/strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({})
  ],
  providers: [
    StaffService,
    StaffJwtStrategy
  ],
  controllers: [StaffController]
})
export class StaffModule {}
