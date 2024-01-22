import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankAccountDto } from 'src/components/account/dto/account.dto';
import { UserDto } from 'src/components/user/dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('user') private userModel: Model<UserDto>) {}

  async createUser(user: UserDto): Promise<UserDto> {
    const newUser = await this.userModel.create(user);
    return newUser;
  }

  async getUserByEmail({ email }: { email: string }): Promise<UserDto | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }
  async updateUser({ user }: { user: UserDto }): Promise<UserDto | null> {
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

  async userHasAccounts(user: UserDto): Promise<Boolean> {
    const state = user.accounts && user.accounts.length > 0;
    return state;
  }

  async addAccountToUser(user: UserDto, account: BankAccountDto) {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: user.email },
      { $push: { accounts: account } },
      { new: true },
    );
    return updatedUser;
  }
  async removeAccountFromUser(email: string, accountId: string) {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: email },
      { $pull: { accounts: { $in: [accountId] } } },
      { new: true },
    );

    return updatedUser;
  }
}
