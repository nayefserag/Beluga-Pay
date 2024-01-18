import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { BankAccountDto, UpdateBankAccountDto } from './account.dto';
import { AccountMessages } from './account.assets';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  async create(@Body() account: BankAccountDto) {
    await this.accountService.checkAndcreateAccount(account);
    return {
      message: 'Account created successfully',
      status: HttpStatus.CREATED,
    };
  }

  @Get('getbyid/:id')
  async get(@Param('id') id: string) {
    const account = await this.accountService.getAccounts(id, null, null);
    return {
      message: 'Accounts fetched successfully',
      status: HttpStatus.OK,
      data: account,
    };
  }

  @Get('getbyemail/:email')
  async getByEmail(@Param('email') email: string) {
    const account = await this.accountService.getAccounts(null, null, email);
    return {
      message: 'Accounts fetched successfully',
      status: HttpStatus.OK,
      data: account,
    };
  }

  @Get('getbyaccountnumber/:accountNumber')
  async getByAccountNumber(@Param('accountNumber') accountNumber: string) {
    const account = await this.accountService.getAccounts(
      null,
      accountNumber,
      null,
    );
    return {
      message: 'Accounts fetched successfully',
      status: HttpStatus.OK,
      data: account,
    };
  }

  // @Get('getalluseraccounts/:email')
  // async getAllUserAccounts(@Param('email') email: string) {
  //   const account = await this.accountService.getAllUserAccounts(email);
  //   return {
  //     message: 'Accounts fetched successfully',
  //     status: HttpStatus.OK,
  //     data: account,
  //   }
  // }

  @Patch('updateaccount/:email')
  async updateAccount(
    @Body() account: UpdateBankAccountDto,
    @Param('email') email: string,
  ) {
    await this.accountService.getAccounts(null, null, email);
    const updatedAccount = await this.accountService.updateAccount(
      account,
      email,
    );
    return {
      message: AccountMessages.ACCOUNT_UPDATED_SUCCESSFULLY,
      status: HttpStatus.OK,
      data: updatedAccount,
    };
  }

  @Delete('deleteaccount/:email')
  async deleteAccount(@Param('email') email: string) {
    await this.accountService.getAccounts(null, null, email);
    await this.accountService.deleteAccount(email);
    return {
      message: AccountMessages.ACCOUNT_DELETED_SUCCESSFULLY,
      status: HttpStatus.OK,
    };
  }
}
