import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserLoginDto, UserRegisterDto } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('UserService', () => {
  let service: UserService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn()
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: prismaMock
        },
        ConfigService,
        JwtService
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaMock.user.findUnique.mockClear();
    prismaMock.user.findMany.mockClear();
    prismaMock.user.create.mockClear();
  });

  describe('createUser', () => {
    it('should create a new user',async () => {
      const userDto = new UserRegisterDto();
      userDto.password = 'Admin123@';
      userDto.email = "test@test.com";
      userDto.firstName = "John";
      userDto.lastName = "Doe";

      const hash = await argon.hash(userDto.password, {saltLength: 12});
      userDto.password = hash;

      prismaMock.user.create.mockReturnValue({...userDto});

      expect(prismaMock.user.create);
    })
  });

  describe('login', () => {
    it('should log user in',async () => {
      const dto = new UserLoginDto();
      dto.email = "test@test.com";
      dto.password = "Admin123@";

      const hash = await argon.hash(dto.password, {saltLength: 12});
      const pwMatches = await argon.verify(hash, dto.password, {saltLength: 12});

      prismaMock.user.findUnique.mockReturnValue({where: {email: dto.email}});
      expect(pwMatches).toEqual(true);
      expect(prismaMock.user.findUnique);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
