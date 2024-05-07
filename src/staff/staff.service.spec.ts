import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StaffLoginDto, StaffRegisterDto } from './dto';
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

  describe('login', () => {
    it('No user should be found', async () => {
      
      expect(prismaMock.staff.findUnique.mockRejectedValue(null));
    });

    it('Should log user in', async () => {
      const loginDto: StaffLoginDto = {
        email: "staff@test.com",
        password: "Admin123@"
      }
      const dto = new StaffRegisterDto();
      dto.email = "staff@test.com";
      dto.firstName = "John";
      dto.lastName = "Doe";
      dto.role = "manager";
      dto.password = "Admin123@";

      const password = await argon.hash(dto.password, {saltLength: 12});
      dto.password = password;

      prismaMock.staff.create.mockReturnValue({...dto});
      prismaMock.staff.findUnique.mockReturnValue({...loginDto})
      expect(prismaMock.staff.create);
      expect(prismaMock.staff.findUnique);
    });
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
