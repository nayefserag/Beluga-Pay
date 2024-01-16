import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMessages } from 'src/aassets/user';
import { UserDto } from 'src/dto/user.dto';
import { UserRepository } from '../../repos/user.repo';

@Injectable()
export class UserService {
  @InjectModel('user') private userModel: Model<UserDto>;
  constructor(private readonly UserRepository: UserRepository) {}
  async createUser(user: UserDto): Promise<UserDto> {
    const newUser = await this.UserRepository.createUser(user);
    return newUser;
  }

  async getUser(email: string): Promise<UserDto> {
    const user = await this.UserRepository.getUserByEmail(email);
    if (!user) {
      throw new Error(UserMessages.USER_NOT_FOUND);
    }
    return user;
  }

  async updateUser(user: UserDto): Promise<UserDto> {
    const exist = await this.UserRepository.getUserByEmail(user.email);
    if (!exist) {
      throw new Error(UserMessages.USER_NOT_FOUND);
    }

    const newUser = await this.UserRepository.updateUser(user);

    return newUser;
  }

  async checkAndCreateUser(user: UserDto): Promise<UserDto> {
    const exist = await this.UserRepository.getUserByEmail(user.email);
    if (exist) {
      throw new Error(UserMessages.USER_IS_ALREADY_REGISTERED);
    }
    const newUser = await this.UserRepository.createUser(user);
    return newUser;
  }

  async deleteUser(email: string) {
    const exist = await this.UserRepository.getUserByEmail(email);
    if (!exist) {
      throw new Error(UserMessages.USER_NOT_FOUND);
    }

    const deletedUser = await this.UserRepository.deleteUser(email);

    return deletedUser;}
}
