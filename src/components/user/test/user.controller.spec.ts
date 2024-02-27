import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dto/create-user';
import { UpdateUserDto } from '../dto/update-user';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            checkAndCreateUser: jest.fn(),
            getUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'test',
      email: 'test@test.com',
      password: 'test',
      accounts: ['test'],
    };
    jest
      .spyOn(userService, 'checkAndCreateUser')
      .mockResolvedValue(createUserDto);
    expect(await userController.create(createUserDto)).toEqual({
      message: 'User created successfully',
      status: 201,
      data: createUserDto,
    });
  });

  it('should get a user', async () => {
    const email =  'test@test.com' ;
    const user = {
      email,
      name: 'test',
      password: 'test',
      accounts: ['test'],
    };
    jest.spyOn(userService, 'getUser').mockResolvedValue(user);
    expect(await userController.getUser(email)).toEqual({
      message: 'User fetched successfully',
      status: 200,
      data: user,
    });
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'updated',
      email: 'test@test.com',
      password: 'updated',
      accounts: ['updated'],
    };
    jest.spyOn(userService, 'updateUser').mockResolvedValue(updateUserDto);
    expect(await userController.updateUser(updateUserDto)).toEqual({
      message: 'User updated successfully',
      status: 200,
      data: updateUserDto,
    });
  });

  it('should delete a user', async () => {
    const emailDto =  'test@test.com' ;
    jest.spyOn(userService, 'deleteUser').mockResolvedValue(true);
    expect(await userController.deleteUser(emailDto)).toEqual({
      message: 'User deleted successfully',
      status: 204,
    });
  });
});
