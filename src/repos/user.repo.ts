import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('user') private userModel: Model<UserDto>) {}

  async createUser(user: UserDto): Promise<UserDto> {
    const newUser = await this.userModel.create(user);
    return newUser;
  }

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

  async deleteUser(email: string) {
    await this.userModel.deleteOne({ email });
    return true;
  }
}
