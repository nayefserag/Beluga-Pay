import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AccountMessages } from 'src/components/account/account.assets';
import {
  BankAccountDto,
  UpdateBankAccountDto,
} from 'src/components/account/account.dto';
import { UserRepository } from 'src/repos/user.repo';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectModel('account') private accountModel: Model<BankAccountDto>,
    @InjectModel('user') private userModel: Model<BankAccountDto>,
    private readonly UserRepository: UserRepository,
  ) {}

  async createAccount(account: BankAccountDto): Promise<BankAccountDto> {
    const newAccount = await this.accountModel.create(account);
    return newAccount;
  }

  async getBy(
    id: string,
    accountNumber?: string,
    email?: string,
  ): Promise<BankAccountDto> {
    //need review
    if (accountNumber) {
      return await this.accountModel.findOne({ accountNumber });
    }
    if (email) {
      return await this.accountModel.findOne({ email });
    }
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const account = await this.accountModel.findById(id);
    return account;
  }

  // async getAllUserAccounts(email: string): Promise<BankAccountDto[]> {
  //   return await this.accountModel.find({email});
  // }

  async updateAccount(
    accountUpdate: UpdateBankAccountDto,
    email: string,
  ): Promise<UpdateBankAccountDto> {
    const find = await this.getBy(null, null, email);
    if (!find) {
      throw new HttpException(
        AccountMessages.ACCOUNT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedAccount = await this.accountModel.findOneAndUpdate(
      { email: email },
      accountUpdate,
      { new: true },
    );

    if (!updatedAccount) {
      throw new HttpException(
        AccountMessages.ACCOUNT_DETAILS_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return updatedAccount;
  }

  async deleteAccount(email: string) {
    const account = await this.getBy(null, null, email);
    if (!account) {
      throw new HttpException(
        AccountMessages.ACCOUNT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    if (account.transactions.length > 0) {
      throw new HttpException(
        AccountMessages.ACCOUNT_HAS_TRANSACTIONS,
        HttpStatus.FORBIDDEN,
      );
    }
    const user = await this.UserRepository.removeAccountFromUser(account.email, account._id.toString())
    await this.accountModel.findOneAndDelete({ email });
  }
}
