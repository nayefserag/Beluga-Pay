import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BankAccountDto } from 'src/components/account/account.dto';
import {
  TransactionViaAccountNumberDto,
  TransactionViaPhoneDto,
} from 'src/components/transaction/transaction.dto';
import { UserDto } from 'src/components/user/user.dto';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel('account') private accountModel: Model<BankAccountDto>,
    @InjectModel('user') private userModel: Model<UserDto>,
    @InjectModel('transaction')
    private transactionModel: Model<TransactionViaPhoneDto>,
  ) {}

  async newTransaction(
    sendMoneyDto: TransactionViaPhoneDto,
  ): Promise<TransactionViaPhoneDto | TransactionViaAccountNumberDto> {
    sendMoneyDto.status = 'pending';
    const newTransaction = await this.transactionModel.create(sendMoneyDto);
    return newTransaction;
  }

  async getTransactionById(
    id: string,
  ): Promise<TransactionViaPhoneDto | TransactionViaAccountNumberDto | null> {
    const transaction = await this.transactionModel.findById(id);
    return transaction;
  }

  async updateTransaction(
    transaction: TransactionViaPhoneDto | TransactionViaAccountNumberDto,
  ) {
    const updatedTransaction = await this.transactionModel.findOneAndUpdate(
      { _id: transaction._id },
      transaction,
      { new: true },
    );
    return updatedTransaction;
  }

  async getAllTransactionsForUser(
    userId: string,
  ): Promise<Array<TransactionViaPhoneDto | TransactionViaAccountNumberDto>> {
    const transactions = await this.transactionModel.find({
      $or: [{ 'sender.userId': userId }, { 'receiver.userId': userId }],
    });
    console.log(transactions);
    console.log(typeof transactions);
    return transactions;
  }
}
