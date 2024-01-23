import { HttpException, HttpStatus } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { UserRepository } from '../../../repos/user.repo';
import { CreateUserDto } from '../dto/create-user';
import { UserMessages } from '../user.assets';
import { UserService } from '../user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            createUser: jest.fn(),
            getUserByEmail: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            userHasAccounts: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'test',
      name: 'Test User',
      accounts: [],
    };
    const hashedPassword = `${createUserDto.password}`;
    jest
      .spyOn(userRepository, 'createUser')
      .mockResolvedValue({ ...createUserDto, password: hashedPassword });
    const result = await userService.createUser(createUserDto);
    expect(result).toEqual({ ...createUserDto, password: hashedPassword });
    expect(userRepository.createUser).toHaveBeenCalledWith({
      ...createUserDto,
    });
  });

  it('should get a user', async () => {
    const user: CreateUserDto = {
      email: 'test@example.com',
      password: 'test',
      name: 'Test User',
      accounts: [],
    };
    jest.spyOn(userRepository, 'getUserByEmail').mockResolvedValue(user);
    const result = await userService.getUser('test@example.com');
    expect(result).toEqual(user);
  });

  it('should throw an exception if user not found on getUser', async () => {
    jest.spyOn(userRepository, 'getUserByEmail').mockResolvedValue(null);
    await expect(userService.getUser('test@example.com')).rejects.toThrow(
      new HttpException(UserMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should update a user', async () => {
    const user: CreateUserDto = {
      email: 'test@example.com',
      password: 'test',
      name: 'Test User',
      accounts: [],
    };
    jest.spyOn(userRepository, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(userRepository, 'updateUser').mockResolvedValue(user);
    const result = await userService.updateUser(user);
    expect(result).toEqual(user);
  });

  it('should throw an exception if user not found on updateUser', async () => {
    jest.spyOn(userRepository, 'getUserByEmail').mockResolvedValue(null);
    await expect(
      userService.updateUser({
        email: 'test@example.com',
        password: 'test',
        name: 'Test User',
        accounts: [],
      }),
    ).rejects.toThrow(
      new HttpException(UserMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should check and create a user', async () => {
    const user: CreateUserDto = {
      email: 'test@example.com',
      password: 'test',
      name: 'Test User',
      accounts: [],
    };
    jest.spyOn(userRepository, 'getUserByEmail').mockResolvedValue(null);
    jest.spyOn(userRepository, 'createUser').mockResolvedValue(user);
    const result = await userService.checkAndCreateUser(user);
    expect(result).toEqual(user);
  });

  it('should throw an exception if user already exists on checkAndCreateUser', async () => {
    const user: CreateUserDto = {
      email: 'test@example.com',
      password: 'test',
      name: 'Test User',
      accounts: [],
    };
    jest.spyOn(userRepository, 'getUserByEmail').mockResolvedValue(user);
    await expect(userService.checkAndCreateUser(user)).rejects.toThrow(
      new HttpException(
        UserMessages.USER_IS_ALREADY_REGISTERED,
        HttpStatus.CONFLICT,
      ),
    );
  });

  it('should delete a user', async () => {
    const user = {
      email: 'test@example.com',
      password: 'test',
      name: 'Test User',
      accounts: [],
    };
    jest.spyOn(userRepository, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(userRepository, 'userHasAccounts').mockResolvedValue(false);
    jest.spyOn(userRepository, 'deleteUser').mockResolvedValue(true);
    const result = await userService.deleteUser(user.email);
    expect(result).toBe(true);
  });

  it('should throw an exception if user not found on deleteUser', async () => {
    const email = 'test@example.com';
    jest.spyOn(userRepository, 'getUserByEmail').mockResolvedValue(null);
    await expect(userService.deleteUser(email)).rejects.toThrow(
      new HttpException(UserMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND),
    );
  });

  it('should throw an exception if user has accounts on deleteUser', async () => {
    const user: CreateUserDto = {
      email: 'test@example.com',
      password: 'test',
      name: 'Test User',
      accounts: [],
    };
    jest.spyOn(userRepository, 'getUserByEmail').mockResolvedValue(user);
    jest.spyOn(userRepository, 'userHasAccounts').mockResolvedValue(true);
    await expect(userService.deleteUser(user.email)).rejects.toThrow(
      new HttpException(UserMessages.USER_HAS_ACCOUNTS, HttpStatus.FORBIDDEN),
    );
  });
});
