import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StaffRegisterDto } from './dto';
import * as argon from 'argon2';

describe('StaffService', () => {
  let service: StaffService;

  const prismaMock = {
    staff: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn()
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        ConfigService,
        JwtService
      ],
    }).compile();

    service = module.get<StaffService>(StaffService);
  });


  describe('createStaff', () => {
    it('Should create a new staff',async () => {
      const dto = new StaffRegisterDto();
      dto.email = "staff@test.com";
      dto.firstName = "John";
      dto.lastName = "Doe";
      dto.role = "manager";
      dto.password = "Admin123@";

      const password = await argon.hash(dto.password, {saltLength: 12});
      dto.password = password;

      prismaMock.staff.create.mockReturnValue({...dto});
      expect(prismaMock.staff.create);
    });
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
