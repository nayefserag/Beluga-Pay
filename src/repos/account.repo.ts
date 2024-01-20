import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { AccountMessages } from 'src/components/account/account.assets';
import {
  BankAccountDto,
  UpdateBankAccountDto,
} from 'src/components/account/account.dto';
import {
  TransactionViaAccountNumberDto,
  TransactionViaPhoneDto,
} from 'src/components/transaction/transaction.dto';
import { UserRepository } from 'src/repos/user.repo';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectModel('account') private accountModel: Model<BankAccountDto>,
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
    phoneNumber?: string,
  ): Promise<BankAccountDto> {
    //need review
    if (accountNumber) {
      return await this.accountModel.findOne({ accountNumber });
    }
    if (email) {
      return await this.accountModel.findOne({ email });
    }
    if (phoneNumber) {
      return await this.accountModel.findOne({ phoneNumber });
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
    await this.UserRepository.removeAccountFromUser(
      account.email,
      account._id.toString(),
    );
    await this.accountModel.findOneAndDelete({ email });
  }

  async checkBalance(
    senderAccount: BankAccountDto,
    recipientAccount: BankAccountDto,
  ) {
    if (senderAccount.accountNumber === recipientAccount.accountNumber) {
      throw new HttpException(
        'Sender and recipient cannot be the same account',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addTransactionToAccounts(
    senderAccount: BankAccountDto,
    recipientAccount: BankAccountDto,
    transaction: TransactionViaPhoneDto | TransactionViaAccountNumberDto,
    status: string = 'pending',
  ) {
    await this.checkBalance(senderAccount, recipientAccount);
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
}
