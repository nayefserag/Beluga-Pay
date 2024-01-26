import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionViaAccountNumberDto } from './dto/create-transaction-via-account-number';
import { TransactionViaPhoneDto } from './dto/create-transaction-via-phone-number';
import { TransactionService } from './transaction.service';
import { TransactionMessages } from './transaction.assets';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/options/pagination.dto';
@ApiTags('Transaction CRUD')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('send-money/via-phone')
  @ApiOperation({ summary: 'Send Money Via Phone' })
  @ApiCreatedResponse({
    description: 'Transaction Created',
    type: TransactionViaPhoneDto,
    status: 201,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' , status: 400})
  @ApiBody({
    description: 'Details of the transaction to send money via phone number',
    type: TransactionViaPhoneDto,
  })
  async sendMoneyViaPhone(@Body() sendingProcess: TransactionViaPhoneDto) {
    const transaction = await this.transactionService.sendMoney(sendingProcess);
    return {
      message: `Transaction From ${sendingProcess.sender} To ${sendingProcess.receiver}  Done successfully`,
      status: HttpStatus.CREATED,
      data: transaction,
    };
  }

  @Post('send-money/via-account-number')
  @ApiOperation({ summary: 'Send Money Via Account Number' })
  @ApiCreatedResponse({
    description: 'Transaction Created',
    type: TransactionViaAccountNumberDto,
    status: 201,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' , status: 400})
  @ApiBody({
    description: 'Details of the transaction to send money via account number',
    type: TransactionViaAccountNumberDto,
  })
  async sendMoneyViaAccount(
    @Body() sendingProcess: TransactionViaAccountNumberDto,
  ) {
    const transaction = await this.transactionService.sendMoney(sendingProcess);
    return {
      message: `Transaction From ${sendingProcess.sender} To ${sendingProcess.receiver}  Done successfully`,
      status: HttpStatus.CREATED,
      data: transaction,
    };
  }

  @Patch('accept-transaction')
  @ApiOperation({ summary: 'Accept Transaction' })
  @ApiOkResponse({ description: 'Accepted Transaction' , status: 200})
  @ApiBadRequestResponse({ description: 'Bad Request' , status: 400})
  @ApiBody({
    description: 'ID of the transaction to accept',
    type: String,
  })
  async acceptTransaction(@Body() data: string) {
    const transaction = await this.transactionService.getTransactionById(data);
    const transactionUpdatedStatus =
      await this.transactionService.transactinStatus({
        transaction,
        status: 'accepted',
      });

    await this.transactionService.addTransactionToAccounts({
      transaction: transactionUpdatedStatus,
      status: 'accepted',
    });

    return {
      message: TransactionMessages.TRANSACTION_UPDATED,
      status: HttpStatus.OK,
      data: transaction,
    };
  }

  @Patch('reject-transaction')
  @ApiOperation({ summary: 'Reject Transaction' })
  @ApiOkResponse({ description: 'Rejected Transaction' , status: 200})
  @ApiBadRequestResponse({ description: 'Bad Request' , status: 400})
  @ApiBody({
    description: 'ID of the transaction to reject',
    type: String,
  })
  async rejectTransaction(@Body() data: string) {
    const transaction = await this.transactionService.getTransactionById(data);
    const transactionUpdated = await this.transactionService.transactinStatus({
      transaction,
      status: 'rejected',
    });

    await this.transactionService.addTransactionToAccounts({
      transaction: transactionUpdated,
      status: 'rejected',
    });
    return {
      message: TransactionMessages.TRANSACTION_REJECTED,
      status: HttpStatus.OK,
      data: transaction,
    };
  }

  @Get('My-transactions/:id')
  @ApiOperation({ summary: 'Get My Transactions' })
  @ApiOkResponse({ description: 'List of My Transactions' , status: 200})
  @ApiBadRequestResponse({ description: 'Bad Request' , status: 400})
  @ApiParam({
    name: 'id',
    required: true,
    description: 'User ID to retrieve transactions',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of transactions per page',
    type: Number,
  })
  async allTranaction(
    @Param('id') id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const options: PaginationDto = { page, limit };
    const transactions = await this.transactionService.getAllTransactions(
      id,
      options,
    );
    return {
      message: TransactionMessages.TRANSACTION_REJECTED,
      status: HttpStatus.OK,
      data: transactions,
    };
  }
}
