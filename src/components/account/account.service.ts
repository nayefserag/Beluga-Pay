import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AccountRepository } from 'src/repos/account.repo';
import { BankAccountDto } from './account.dto';
import { UserRepository } from 'src/repos/user.repo';
import { AccountMessages } from './account.assets';
import { UserMessages } from '../user/user.assets';
@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async createAccount(account: BankAccountDto) {
    const findAccount = await this.accountRepo.getAccountByNumber(
      account.accountNumber,
    );
    if (findAccount) {
      throw new HttpException(
        AccountMessages.ACCOUNT_IS_ALREADY_REGISTERED,
        HttpStatus.CONFLICT,
      );
    }
    const user = await this.userRepo.getUserByEmail(account.email);
    if (!user) {
      throw new HttpException(
        UserMessages.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const newAccount = await this.accountRepo.createAccount(account);
    if (!newAccount) {
      throw new HttpException(
        AccountMessages.ACCOUNT_NOT_CREATED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.userRepo.addAccountToUser(user, newAccount);

    return newAccount;
  }
}
