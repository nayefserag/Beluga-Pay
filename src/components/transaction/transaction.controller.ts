import { Body, Controller, HttpStatus, Patch, Post } from '@nestjs/common';
import {
  TransactionViaPhoneDto,
  TransactionViaAccountNumberDto,
} from './transaction.dto';
import { TransactionService } from './transaction.service';
import { TransactionMessages } from './transaction.assets';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService
                
    ) {}

  @Post('send-money/via-phone')
  async sendMoneyViaPhone(@Body() sendingProcess: TransactionViaPhoneDto) {
    const transaction = await this.transactionService.sendMoney(sendingProcess);
    return {
      message: `Transaction From ${sendingProcess.sender} To ${sendingProcess.receiver}  Done successfully`,
      status: HttpStatus.CREATED,
      data: transaction,
    };
  }

  @Post('send-money/via-account-number')
  async sendMoneyViaAccount(@Body() sendingProcess: TransactionViaAccountNumberDto) {
    const transaction =
      await this.transactionService.sendMoney(sendingProcess);
    return {
      message: `Transaction From ${sendingProcess.sender} To ${sendingProcess.receiver}  Done successfully`,
      status: HttpStatus.CREATED,
      data: transaction,
    };
  }

  @Patch('accept-transaction')
  async acceptTransaction(@Body() data: string) {
    const transaction = await this.transactionService.getTransactionById(data);
    const transactionUpdatedStatus =await this.transactionService.transactinStatus(transaction, 'accepted');
      await this.transactionService.addTransactionToAccounts(transactionUpdatedStatus,'accepted')

    return {
      message: TransactionMessages.TRANSACTION_UPDATED,
      status: HttpStatus.OK,
      data: transaction,
    };
  }

  // @Patch('reject-transaction')
  // async rejectTransaction(@Body() data: string) {
  //   const transaction = await this.transactionService.getTransactionById(data);
  //   const transactionUpdated = await this.transactionService.transactinStatus(transaction, 'rejected');
    
  //   const addedTransaction = await this.transactionService.addTransactionToAccounts(transaction.sender, transaction.receiver, transactionUpdated); 
  //   return {
  //     message: TransactionMessages.TRANSACTION_REJECTED,
  //     status: HttpStatus.OK,
  //     data: transaction,
  //   }
  // }

}
