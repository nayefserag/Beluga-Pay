import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankAccountDto } from 'src/components/account/account.dto';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectModel('account') private accountModel: Model<BankAccountDto>,
  ) {}

  async createAccount(account: BankAccountDto): Promise<BankAccountDto> {
    const newAccount = await this.accountModel.create(account);
    return newAccount;
  }

  async getAccountByNumber(accountNumber: string): Promise<BankAccountDto> {
    const account = await this.accountModel.findOne({ accountNumber });
    return account;
  }
}
