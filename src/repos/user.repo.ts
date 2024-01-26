import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBankAccountDto } from '../components/account/dto/create-account';
import { CreateUserDto } from '../components/user/dto/create-user';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('user') private userModel: Model<CreateUserDto>) {}

  async createUser(user: CreateUserDto): Promise<CreateUserDto> {
    const newUser = await this.userModel.create(user);
    return newUser;
  }

  async getUserByEmail({
    email
  }: {
    email: string;
  }): Promise<CreateUserDto | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }
  async updateUser({
    user,
  }: {
    user: CreateUserDto;
  }): Promise<CreateUserDto | null> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email: user.email },
      user,
      { new: true },
    );
    return updatedUser;
  }

  async deleteUser(email: string): Promise<boolean> {
    await this.userModel.deleteOne({ email });
    return true;
  }

  async userHasAccounts(user: CreateUserDto): Promise<boolean> {
    const state = user.accounts && user.accounts.length > 0;
    return state;
  }

  async addAccountToUser(user: CreateUserDto, account: CreateBankAccountDto) {
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
