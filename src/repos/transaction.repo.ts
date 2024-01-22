import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateBankAccountDto } from 'src/components/account/dto/create-account';
import { TransactionViaAccountNumberDto } from 'src/components/transaction/dto/create-transaction-via-account-number';
import { TransactionViaPhoneDto } from 'src/components/transaction/dto/create-transaction-via-phone-number';
import { CreateUserDto } from 'src/components/user/dto/create-user';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel('account') private accountModel: Model<CreateBankAccountDto>,
    @InjectModel('user') private userModel: Model<CreateUserDto>,
    @InjectModel('transaction')
    private transactionModel: Model<TransactionViaPhoneDto>,
  ) {}

  async newTransaction(
    sendMoneyDto: TransactionViaPhoneDto,
  ): Promise<TransactionViaPhoneDto | TransactionViaAccountNumberDto> {
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
    return transactions;
  }
}
