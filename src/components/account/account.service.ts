import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AccountRepository } from 'src/repos/account.repo';
import { BankAccountDto, UpdateBankAccountDto } from './account.dto';
import { UserRepository } from 'src/repos/user.repo';
import { AccountMessages } from './account.assets';
import { UserMessages } from '../user/user.assets';
import { generateAccountNumber } from 'src/helpers/numbergenerator';
@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async checkAndcreateAccount(account: BankAccountDto) {
    await this.checkAccountExists(account);
    const user = await this.userRepo.getUserByEmail({ email: account.email });
    if (!user) {
      throw new HttpException(
        UserMessages.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    account.accountNumber = generateAccountNumber();
    this.logger.debug(account.accountNumber);
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

  private async checkAccountExists(account: BankAccountDto) {
    const findAccount = await this.accountRepo.getBy({
      accountNumber: account.accountNumber,
      email: account.email,
      phoneNumber: account.phoneNumber,
    });
    if (findAccount) {
      throw new HttpException(
        AccountMessages.ACCOUNT_IS_ALREADY_REGISTERED,
        HttpStatus.CONFLICT,
      );
    }
  }

  async getAccounts(
    filter: {
      id?: string;
      accountNumber?: string;
      email?: string;
    } = {},
  ) {
    const account = await this.accountRepo.getBy(filter);
    if (!account) {
      throw new HttpException(
        AccountMessages.ACCOUNT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return account;
  }

  // async getAllUserAccounts(email: string) {
  //   const user = await this.userRepo.getUserByEmail(email);
  //   if (!user) {
  //     throw new HttpException(
  //       UserMessages.USER_NOT_FOUND,
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   const accounts = await this.accountRepo.getAllUserAccounts(email);
  //   if (accounts.length === 0) {
  //     throw new HttpException(
  //       AccountMessages.User_DOESNT_HAVE_ACCOUNTS,
  //       HttpStatus.NOT_FOUND,
  //     )
  //   }
  //   return accounts;
  // }

  async updateAccount(account: UpdateBankAccountDto, email: string) {
    if (!account) {
      throw new HttpException(
        AccountMessages.ACCOUNT_DETAILS_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedAccount = await this.accountRepo.updateAccount(account, email);
    return updatedAccount;
  }

  async deleteAccount(email: string) {
    const account = await this.accountRepo.deleteAccount(email);
    return account;
  }
}
