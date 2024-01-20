import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  TransactionViaAccountNumberDto,
  TransactionViaPhoneDto,
} from './transaction.dto';
import { TransactionRepository } from 'src/repos/transaction.repo';
import { AccountRepository } from 'src/repos/account.repo';
import { AccountMessages } from '../account/account.assets';
import { TransactionMessages } from './transaction.assets';
@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
  ) {}
  async sendMoney(
    sendMoney: TransactionViaPhoneDto | TransactionViaAccountNumberDto,
  ) {
    if (sendMoney instanceof TransactionViaAccountNumberDto) {
      return await this.receiveMoney(sendMoney);
    }
    else{
    const phoneSender = await this.accountRepository.getBy(
      null,
      null,
      null,
      sendMoney.sender,
    );
    const phoneReceiver = await this.accountRepository.getBy(
      null,
      null,
      null,
      sendMoney.receiver,
    );
    if (!phoneSender) {
      throw new HttpException(
        AccountMessages.ACCOUNT_SENDER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!phoneReceiver) {
      throw new HttpException(
        AccountMessages.ACCOUNT_RECEIVER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const newTransaction =
      await this.transactionRepository.newTransaction(sendMoney);
    const transaction = await this.accountRepository.addTrasactionToAccounts(
      phoneSender,
      phoneReceiver,
      newTransaction,
    );
    return transaction;
    }
  }

  async receiveMoney(
    receiveMoneyDto: TransactionViaPhoneDto | TransactionViaAccountNumberDto,
  ) {
    const transaction = await this.transactionRepository.getTransactionById(
      receiveMoneyDto._id,
    );
    if (!transaction) {
      throw new HttpException(
        TransactionMessages.TRANSACTION_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    transaction.status = 'accepted';
    const updatedTransaction = await this.transactionRepository.updateTransaction(
      transaction,
    );
    return updatedTransaction;
    
  }
}
