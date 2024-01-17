import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMessages } from 'src/aassets/user';
import { UserDto } from 'src/dto/user.dto';
import { Password } from 'src/helpers/password';
import { error } from 'console';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('user') private userModel: Model<UserDto>) {}

  async createUser(user: UserDto): Promise<UserDto> {
    const newUser = await this.userModel.create(user);
    const hashedpassword = await Password.hashPassword(user.password);
    // await newUser.updateOne({ password: hashedpassword });
    newUser.password = hashedpassword;
    newUser.save();
    return newUser;
  }

  async getUserByEmail(email: string): Promise<UserDto | Error> {
    try {
      const user = await this.userModel.findOne({ email });
      return user;
    } catch (error) {
      return error;
    }
  }
  async updateUser(user: UserDto): Promise<UserDto | Error> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { email: user.email },
        user,
        { new: true },
      );
      return updatedUser;
    } catch (error) {
      return error;
    }
  }

  async deleteUser(email: string) {
    try {
      await this.userModel.deleteOne({ email });
      return true;
    } catch (error) {
      return {
        message: UserMessages.USER_DELETED,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
