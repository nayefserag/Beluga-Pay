import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AccountRepository } from '../../repos/account.repo';
import { UserRepository } from '../../repos/user.repo';
import { generator } from '../../helpers/numbergenerator';
import { CreateBankAccountDto } from './dto/create-account';
import { UpdateBankAccountDto } from './dto/update-account';

import { AccountMessages } from './account.assets';
import { UserMessages } from '../user/user.assets';
import { isValidObjectID } from '../../helpers/idValidator';
import { PaginationDto } from 'src/options/pagination.dto';
@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async checkAndcreateAccount(account: CreateBankAccountDto) {
    await this.checkAccountExists(account);
    const user = await this.userRepo.getUserByEmail({ email: account.email });
    if (!user) {
      throw new HttpException(
        UserMessages.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    account.accountNumber = generator('Account Number');
    // this.logger.debug(account.accountNumber);
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

  private async checkAccountExists(account: CreateBankAccountDto) {
    const findAccount = await this.accountRepo.getBy({
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
      _id?: string;
      accountNumber?: string;
      email?: string;
    } = {},
  ) {
    if (filter._id && !isValidObjectID(filter._id)) {
      throw new HttpException(
        AccountMessages.INVALID_OBJECT_ID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const account = await this.accountRepo.getBy(filter);
    if (!account) {
      throw new HttpException(
        AccountMessages.ACCOUNT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return account;
  }

  async getAllUserAccounts(email: string,pagination: PaginationDto) {
    const user = await this.userRepo.getUserByEmail({ email });
    if (!user) {
      throw new HttpException(
        UserMessages.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const accounts = await this.accountRepo.getAllUserAccounts({ email ,pagination});
    if (accounts.length === 0) {
      throw new HttpException(
        AccountMessages.User_DOESNT_HAVE_ACCOUNTS,
        HttpStatus.NOT_FOUND,
      );
    }
    return accounts;
  }

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
