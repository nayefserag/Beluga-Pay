import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, Types } from 'mongoose';
import { AccountMessages } from 'src/components/account/account.assets';
import { CreateBankAccountDto } from 'src/components/account/dto/create-account';
import { UpdateBankAccountDto } from 'src/components/account/dto/update-account';
import { TransactionViaAccountNumberDto } from 'src/components/transaction/dto/create-transaction-via-account-number';
import { TransactionViaPhoneDto } from 'src/components/transaction/dto/create-transaction-via-phone-number';
import { UserRepository } from 'src/repos/user.repo';
import { TransactionRepository } from './transaction.repo';
import { constructObjId } from 'src/helpers/idValidator';
import { Account } from 'src/Schema/account.schema';

@Injectable()
export class AccountRepository {
  private readonly logger = new Logger(AccountRepository.name);
  constructor(
    @InjectModel('account') private accountModel: Model<CreateBankAccountDto>,
    private readonly UserRepository: UserRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async createAccount(
    account: CreateBankAccountDto,
  ): Promise<CreateBankAccountDto> {
    const newAccount = await this.accountModel.create(account);
    return newAccount;
  }

  async getBy(
    filter: FilterQuery<Account>,
    select: ProjectionType<Account> = {},
  ): Promise<CreateBankAccountDto | null> {
    if (filter._id) {
      filter._id = constructObjId(filter._id);
    }
    const account = await this.accountModel.findOne(filter, select, {}).exec();
    return account;
  }

  async getAllUserAccounts({
    email,
  }: {
    email: string;
  }): Promise<CreateBankAccountDto[]> {
    return await this.accountModel.find({ email });
  }

  async updateAccount(
    accountUpdate: UpdateBankAccountDto,
    email: string,
  ): Promise<UpdateBankAccountDto> {
    const find = await this.getBy({ email });
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
    ).exec();

    if (!updatedAccount) {
      throw new HttpException(
        AccountMessages.ACCOUNT_DETAILS_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return updatedAccount;
  }

  async deleteAccount(email: string) {
    const account = await this.getBy({ email });
    if (!account) {
      throw new HttpException(
        AccountMessages.ACCOUNT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const transactions =
      await this.transactionRepository.getAllTransactionsForUser(email);
    if (transactions.length > 0) {
      throw new HttpException(
        AccountMessages.ACCOUNT_HAS_TRANSACTIONS,
        HttpStatus.FORBIDDEN,
      );
    }
    await this.UserRepository.removeAccountFromUser(
      account.email,
      account._id.toString(),
    );
    await this.accountModel.findOneAndDelete({ email });
  }

  async checkBalance(
    senderAccount: CreateBankAccountDto,
    recipientAccount: CreateBankAccountDto,
    transaction: TransactionViaPhoneDto | TransactionViaAccountNumberDto,
  ): Promise<Boolean> {
    if (senderAccount.accountNumber === recipientAccount.accountNumber) {
      throw new HttpException(
        'Sender and recipient cannot be the same account',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (senderAccount.balance < transaction.amount) {
      return false;
    }
    return true;
  }

  async addTransactionToAccounts(
    senderAccount: CreateBankAccountDto,
    recipientAccount: CreateBankAccountDto,
    transaction: TransactionViaPhoneDto | TransactionViaAccountNumberDto,
    status: string = 'pending',
  ) {
    await this.checkBalance(senderAccount, recipientAccount, transaction);
    if (status === 'accepted') {
      if (senderAccount.balance < transaction.amount) {
        throw new HttpException(
          'Insufficient funds to complete the transaction',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.accountModel.findOneAndUpdate(
        { _id: recipientAccount._id },
        {
          $push: { transactions: transaction },
          $set: { balance: recipientAccount.balance + transaction.amount },
        },
        { new: true },
      );
      await this.accountModel.findOneAndUpdate(
        { _id: senderAccount._id },
        {
          $push: { transactions: transaction },
          $set: { balance: senderAccount.balance - transaction.amount },
        },
        { new: true },
      );
    }

    if (status === 'rejected' || status === 'pending') {
      await this.accountModel.findOneAndUpdate(
        { _id: senderAccount._id },
        { $push: { transactions: transaction } },
        { new: true },
      );
      await this.accountModel.findOneAndUpdate(
        { _id: recipientAccount._id },
        { $push: { transactions: transaction } },
        { new: true },
      );
    } else {
      throw new HttpException(
        'Invalid transaction status',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async checkEnough(balance: number, amount: number) {
    if (balance < amount) {
      throw new HttpException(
        'you dont have enough money to pay bill',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
