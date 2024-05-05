import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('Should call the createUser method of the UserService',async () => {
      const dto: UserRegisterDto = {
        email: 'test@test.com',
        password: 'Admin123@',
        firstName: 'John',
        lastName: 'Doe'
      }

      await controller.createUser(dto);

      expect(service.createUser).toHaveBeenCalledWith(dto);
    })
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
