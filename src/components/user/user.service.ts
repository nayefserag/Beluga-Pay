import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserMessages } from './user.assets';
import { CreateUserDto } from './dto/create-user';
import { UserRepository } from '../../repos/user.repo';
import { Password } from '../../helpers/password';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(user: CreateUserDto): Promise<CreateUserDto> {
    user.password = await Password.hashPassword(user.password);
    const newUser = await this.userRepository.createUser(user);
    return newUser;
  }

  async getUser(email: string): Promise<CreateUserDto> {
    const user = await this.userRepository.getUserByEmail({ email });
    if (!user) {
      throw new HttpException(
        UserMessages.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async updateUser(user: CreateUserDto): Promise<CreateUserDto | null> {
    const exist = await this.userRepository.getUserByEmail({
      email: user.email,
    });
    if (!exist) {
      throw new HttpException(
        UserMessages.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const newUser = await this.userRepository.updateUser({ user });

    return newUser;
  }

  async checkAndCreateUser(user: CreateUserDto): Promise<CreateUserDto> {
    const exist = await this.userRepository.getUserByEmail({
      email: user.email,
    });
    if (exist) {
      throw new HttpException(
        UserMessages.USER_IS_ALREADY_REGISTERED,
        HttpStatus.CONFLICT,
      );
    }
    const newUser = await this.createUser(user);
    if (!newUser) {
      throw new HttpException(
        UserMessages.USER_NOT_CREATED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return newUser;
  }

  async deleteUser(email: string): Promise<boolean | null> {
    const userOrError = await this.userRepository.getUserByEmail({ email });
    if (!userOrError) {
      throw new HttpException(
        UserMessages.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const hasAccounts = await this.userRepository.userHasAccounts(userOrError);
    if (hasAccounts) {
      throw new HttpException(
        UserMessages.USER_HAS_ACCOUNTS,
        HttpStatus.FORBIDDEN,
      );
    }

    const deletedUser = await this.userRepository.deleteUser(email);
    if (!deletedUser) {
      throw new HttpException(
        UserMessages.USER_NOT_DELETED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return deletedUser;
  }
}
