import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  TransactionViaAccountNumberDto,
  TransactionViaPhoneDto,
} from './transaction.dto';
import { TransactionRepository } from 'src/repos/transaction.repo';
import { AccountRepository } from 'src/repos/account.repo';
import { AccountMessages } from '../account/account.assets';
import { TransactionMessages } from './transaction.assets';
import { BankAccountDto } from '../account/account.dto';
@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
  ) {}
  //   async sendMoney(
  //     sendMoney: TransactionViaPhoneDto | TransactionViaAccountNumberDto,
  //   ) {
  //     const phoneSender = await this.accountRepository.getBy(
  //       null,
  //       null,
  //       null,
  //       sendMoney.sender,
  //     );
  //     const phoneReceiver = await this.accountRepository.getBy(
  //       null,
  //       null,
  //       null,
  //       sendMoney.receiver,
  //     );
  //     if (!phoneSender) {
  //       throw new HttpException(
  //         AccountMessages.ACCOUNT_SENDER_NOT_FOUND,
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     if (!phoneReceiver) {
  //       throw new HttpException(
  //         AccountMessages.ACCOUNT_RECEIVER_NOT_FOUND,
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     const newTransaction =
  //       await this.transactionRepository.newTransaction(sendMoney);
  //     const transaction = await this.accountRepository.addTrasactionToAccounts(
  //       phoneSender,
  //       phoneReceiver,
  //       newTransaction,
  //     );
  //     return transaction;
  //   }

  //   async sendoMoneyViaAccountNumber(
  //     sendMoney: TransactionViaPhoneDto | TransactionViaAccountNumberDto,
  //   ) {
  //     const accountNumberSender = await this.accountRepository.getBy(
  //       null,
  //       sendMoney.sender,
  //       null,
  //       null,
  //     );

  //     const accountNumberReceiver = await this.accountRepository.getBy(
  //       null,
  //       sendMoney.receiver,
  //       null,
  //       null,
  //     );

  //     if (!accountNumberSender) {
  //       throw new HttpException(
  //         AccountMessages.ACCOUNT_SENDER_NOT_FOUND,
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     if (!accountNumberReceiver) {
  //       throw new HttpException(
  //         AccountMessages.ACCOUNT_RECEIVER_NOT_FOUND,
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }
  //     const newTransaction =
  //       await this.transactionRepository.newTransaction(sendMoney);
  //     const transaction = await this.accountRepository.addTrasactionToAccounts(
  //       accountNumberSender,
  //       accountNumberReceiver,
  //       newTransaction,
  //     );
  //     return transaction;
  //   }
  async sendMoney(
    sendMoneyDto: TransactionViaPhoneDto | TransactionViaAccountNumberDto,
  ) {
    await this.accountRepository.checkBalance(
      sendMoneyDto.sender,
      sendMoneyDto.receiver,
    )
    let sender;
    let receiver;

    if (sendMoneyDto instanceof TransactionViaPhoneDto) {
      sender = await this.accountRepository.getBy(
        null,
        null,
        null,
        sendMoneyDto.sender,
      );
      receiver = await this.accountRepository.getBy(
        null,
        null,
        null,
        sendMoneyDto.receiver,
      );
    } else if (sendMoneyDto instanceof TransactionViaAccountNumberDto) {
      sender = await this.accountRepository.getBy(
        null,
        sendMoneyDto.sender,
        null,
        null,
      );
      receiver = await this.accountRepository.getBy(
        null,
        sendMoneyDto.receiver,
        null,
        null,
      );
    } else {
      throw new HttpException(
        'Invalid transaction type',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!sender) {
      throw new HttpException(
        AccountMessages.ACCOUNT_SENDER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!receiver) {
      throw new HttpException(
        AccountMessages.ACCOUNT_RECEIVER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const newTransaction =
      await this.transactionRepository.newTransaction(sendMoneyDto);
    const transaction = await this.accountRepository.addTransactionToAccounts(
      sender,
      receiver,
      newTransaction,
      
    );

    

    return transaction;
  }

  async transactinStatus(
    transaction: TransactionViaPhoneDto | TransactionViaAccountNumberDto,
    status: string,
  ) {

    transaction.status = status;

    const updatedTransaction =
      await this.transactionRepository.updateTransaction(transaction);
    return updatedTransaction;
  }

  async getTransactionById(id: string): Promise<TransactionViaPhoneDto | TransactionViaAccountNumberDto> {
    const transaction = await this.transactionRepository.getTransactionById(
      id,
    )
    if (!transaction) {
      throw new HttpException(
        TransactionMessages.TRANSACTION_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      )
    }
    return transaction
  }

  async addTransactionToAccounts(
    sender: BankAccountDto,
    recipient: BankAccountDto,
    transaction: TransactionViaPhoneDto | TransactionViaAccountNumberDto,
    status: string = 'pending',
  ){
    await this.accountRepository.checkBalance(sender, recipient);
    await this.accountRepository.addTransactionToAccounts(
        sender,
        recipient,
        transaction,
        status
      );
  }

}
