import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankAccountDto } from 'src/components/account/account.dto';
import { UserDto } from 'src/components/user/user.dto';

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

  async deleteUser(email: string): Promise<Boolean> {
    await this.userModel.deleteOne({ email });
    return true;
  }

  async userHasAccounts(user: UserDto) {
    return user.accounts && user.accounts.length > 0;
  }

  async addAccountToUser(user: UserDto, account: BankAccountDto) {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: user.email },
      { $push: { accounts: account } },
      { new: true },  
    )
    return updatedUser;
  }
}
