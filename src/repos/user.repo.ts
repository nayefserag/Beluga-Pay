import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UpdateUserDto, UserDto } from 'src/dto/user.dto';
import { Password } from 'src/helpers/password';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('user') private userModel: Model<UserDto>) {}

  async createUser(user: UserDto): Promise<UserDto> {
    const newUser = await this.userModel.create(user);
    const hashedpassword = await Password.hashPassword(user.password);
    newUser.password = hashedpassword;
    // await newUser.updateOne({ password: hashedpassword });
    newUser.save();
    return newUser;
  }

  async getUserByEmail(email: string): Promise<UserDto | Error> {
    const user = await this.userModel.findOne({ email });
    return user;
  }
  async updateUser(user: UserDto): Promise<UserDto | Error> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: user.email },
      user,
      { new: true },
    );
    return updatedUser;
  }

  async deleteUser(email: string) {
    await this.userModel.deleteOne({ email });
    return true;
  }

  async userHasAccounts(user: UserDto) {
    return user.accounts && user.accounts.length > 0;
  }
}
