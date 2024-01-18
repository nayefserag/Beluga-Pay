import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/components/user/user.dto';
import { Password } from 'src/helpers/password';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('user') private userModel: Model<UserDto>) {}

  async createUser(user: UserDto): Promise<UserDto> {
    const newUser = await this.userModel.create(user);
    return newUser;
  }
  /**
   *
   * @param email
   * @returns
   * @throws {Error} failed
   */
  async getUserByEmail(email: string): Promise<UserDto> {
    const user = await this.userModel.findOne({ email });
    return user;
  }
  async updateUser(user: UserDto): Promise<UserDto> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: user.email },
      user,
      { new: true },
    );
    return updatedUser;
  }

  async deleteUser(email: string): Promise<Boolean> {
    await this.userModel.deleteOne({ email });
    return true;
  }

  async userHasAccounts(user: UserDto) {
    return user.accounts && user.accounts.length > 0;
  }
}
