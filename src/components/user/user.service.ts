import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserMessages } from 'src/components/user/user.assets';
import { UserDto } from 'src/components/user/user.dto';
import { UserRepository } from '../../repos/user.repo';
import { Password } from 'src/helpers/password';

@Injectable()
export class UserService {
  constructor(private readonly UserRepository: UserRepository) {}
  async createUser(user: UserDto): Promise<UserDto> {
    user.password = await Password.hashPassword(user.password);
    const newUser = await this.UserRepository.createUser(user);
    return newUser;
  }

  async getUser(email: string): Promise<UserDto | Error> {
    const user = await this.UserRepository.getUserByEmail(email);
    if (!user) {
      throw new Error(UserMessages.USER_NOT_FOUND);
    }
    return user;
  }

  async updateUser(user: UserDto): Promise<UserDto | Error> {
    const exist = await this.UserRepository.getUserByEmail(user.email);
    if (!exist) {
      throw new Error(UserMessages.USER_NOT_FOUND);
    }

    const newUser = await this.UserRepository.updateUser(user);

    return newUser;
  }

  async checkAndCreateUser(user: UserDto): Promise<UserDto | Error> {
    const exist = await this.UserRepository.getUserByEmail(user.email);
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

  async deleteUser(email: string) {
    const userOrError = await this.UserRepository.getUserByEmail(email);
    if (userOrError instanceof Error) {
      throw userOrError;
    }

    const hasAccounts = await this.UserRepository.userHasAccounts(userOrError);
    if (hasAccounts) {
      throw new HttpException(
        UserMessages.USER_HAS_ACCOUNTS,
        HttpStatus.FORBIDDEN,
      );
    }

    const deletedUser = await this.UserRepository.deleteUser(email);
    if (!deletedUser) {
      throw new HttpException(
        UserMessages.USER_NOT_DELETED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return deletedUser;
  }
}
