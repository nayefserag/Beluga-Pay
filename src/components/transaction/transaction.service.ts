import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransactionViaAccountNumberDto } from './dto/create-transaction-via-account-number';
import { TransactionViaPhoneDto } from './dto/create-transaction-via-phone-number';
import { TransactionMessages } from './transaction.assets';
import { UserMessages } from '../user/user.assets';
import { isValidObjectID } from '../../helpers/idValidator';
import { AccountRepository } from '../../repos/account.repo';
import { TransactionRepository } from '../../repos/transaction.repo';
import { PaginationDto } from 'src/options/pagination.dto';
@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
  ) {}
  async sendMoney(
    sendMoneyDto: TransactionViaPhoneDto | TransactionViaAccountNumberDto,
  ) {
    let sender;
    let receiver;

    if (sendMoneyDto instanceof TransactionViaPhoneDto) {
      const senderAccount = await this.accountRepository.getBy({
        phoneNumber: sendMoneyDto.sender,
      });
      const reciverAccount = await this.accountRepository.getBy({
        phoneNumber: sendMoneyDto.sender,
      });
      if (!senderAccount) {
        throw new HttpException(
          UserMessages.SENDER_USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!reciverAccount) {
        throw new HttpException(
          UserMessages.RECIVER_USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.accountRepository.checkBalance(
        senderAccount,
        reciverAccount,
        sendMoneyDto,
      );
      sender = await this.accountRepository.getBy({
        phoneNumber: sendMoneyDto.sender,
      });
      receiver = await this.accountRepository.getBy({
        phoneNumber: sendMoneyDto.receiver,
      });
    } else if (sendMoneyDto instanceof TransactionViaAccountNumberDto) {
      const senderAccount = await this.accountRepository.getBy({
        accountNumber: sendMoneyDto.sender,
      });
      const reciverAccount = await this.accountRepository.getBy({
        accountNumber: sendMoneyDto.sender,
      });
      if (!senderAccount) {
        throw new HttpException(
          UserMessages.SENDER_USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!reciverAccount) {
        throw new HttpException(
          UserMessages.RECIVER_USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.accountRepository.checkBalance(
        senderAccount,
        reciverAccount,
        sendMoneyDto,
      );

      sender = await this.accountRepository.getBy({
        accountNumber: sendMoneyDto.sender,
      });
      receiver = await this.accountRepository.getBy({
        accountNumber: sendMoneyDto.receiver,
      });
    } else {
      throw new HttpException(
        TransactionMessages.INVALID_TYPE,
        HttpStatus.BAD_REQUEST,
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

  async transactinStatus({
    transaction,
    status,
  }: {
    transaction: TransactionViaPhoneDto | TransactionViaAccountNumberDto;
    status: string;
  }): Promise<TransactionViaPhoneDto | TransactionViaAccountNumberDto> {
    transaction.status = status;

    const updatedTransaction =
      await this.transactionRepository.updateTransaction(transaction);
    if (!updatedTransaction) {
      throw new HttpException(
        TransactionMessages.TRANSACTION_NOT_UPDATED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updatedTransaction;
  }

  async getTransactionById(
    id: string,
  ): Promise<TransactionViaPhoneDto | TransactionViaAccountNumberDto> {
    if (!isValidObjectID(id)) {
      throw new HttpException(
        TransactionMessages.INVALID_TRANSACTION_ID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const transaction = await this.transactionRepository.getTransactionById(id);
    if (!transaction) {
      throw new HttpException(
        TransactionMessages.TRANSACTION_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return transaction;
  }

  async addTransactionToAccounts({
    transaction,
    status = 'pending',
  }: {
    transaction: TransactionViaPhoneDto | TransactionViaAccountNumberDto;
    status?: string;
  }) {
    if (transaction instanceof TransactionViaPhoneDto) {
      const sender = await this.accountRepository.getBy({
        phoneNumber: transaction.sender,
      });
      const reciver = await this.accountRepository.getBy({
        phoneNumber: transaction.receiver,
      });
      if (!sender) {
        throw new HttpException(
          UserMessages.SENDER_USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!reciver) {
        throw new HttpException(
          UserMessages.RECIVER_USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.accountRepository.checkBalance(sender, reciver, transaction);
      await this.accountRepository.addTransactionToAccounts(
        sender,
        reciver,
        transaction,
        status,
      );
    }
    if (transaction instanceof TransactionViaAccountNumberDto) {
      const sender = await this.accountRepository.getBy({
        accountNumber: transaction.sender,
      });
      const reciver = await this.accountRepository.getBy({
        accountNumber: transaction.receiver,
      });
      if (!sender) {
        throw new HttpException(
          UserMessages.SENDER_USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      if (!reciver) {
        throw new HttpException(
          UserMessages.RECIVER_USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.accountRepository.checkBalance(sender, reciver, transaction);
      await this.accountRepository.addTransactionToAccounts(
        sender,
        reciver,
        transaction,
        status,
      );
    }
  }

  async getAllTransactions(id: string,options:PaginationDto) {
    if (!isValidObjectID(id)) {
      throw new HttpException(
        UserMessages.INVALID_USER_ID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = this.accountRepository.getBy({ _id: id }, { _id: true });
    if (!user) {
      throw new HttpException(
        UserMessages.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const transactions =
      await this.transactionRepository.getAllTransactionsForUser(id,options);
    if (transactions.length == 0) {
      throw new HttpException(
        TransactionMessages.TRANSACTION_ZERO,
        HttpStatus.NOT_FOUND,
      );
    }
    return transactions;
  }
}
