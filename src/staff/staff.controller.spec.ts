import { Test, TestingModule } from '@nestjs/testing';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { StaffLoginDto, StaffRegisterDto } from './dto';

describe('StaffController', () => {
  let controller: StaffController;
  let service: StaffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [
        StaffService,
        {
          provide: StaffService,
          useValue: {
            createStaff: jest.fn(),
            login: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<StaffController>(StaffController);
    service = module.get<StaffService>(StaffService);
  });

  describe('createStaff', () => {
    it('Should call the createStaff method of the StaffService',async () => {
      const dto: StaffRegisterDto = {
        email: 'staff@test.com',
        password: 'Admin123@',
        firstName: 'John',
        lastName: 'Doe',
        role: 'manager'
      }

      await controller.createStaff(dto);

      expect(service.createStaff).toHaveBeenCalledWith(dto);
    })
  })

  describe('login', () => {
    it('Should call the login method of the StaffService', async () => {
      const dto: StaffLoginDto = {
        email: 'staff@test.com',
        password: 'Admin123@'
      }

      await controller.login(dto);

      expect(service.login).toHaveBeenCalledWith(dto);
    })
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
