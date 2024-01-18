import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMessages } from 'src/aassets/user';
import { UserDto } from 'src/components/user/user.dto';
import { UserRepository } from '../../repos/user.repo';
import { Password } from 'src/helpers/password';

@Injectable()
export class UserService {
  @InjectModel('user') private userModel: Model<UserDto | Error>;
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
      throw new Error(UserMessages.USER_IS_ALREADY_REGISTERED);
    }
    const newUser = await this.UserRepository.createUser(user);
    if (!newUser) {
      throw new Error(UserMessages.USER_NOT_CREATED);
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
      throw new Error(UserMessages.USER_HAS_ACCOUNTS);
    }

    const deletedUser = await this.UserRepository.deleteUser(email);
    if (!deletedUser) {
      throw new Error(UserMessages.USER_NOT_DELETED);
    }
    return deletedUser;
  }
}
