import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateBankAccountDto } from './dto/create-account';
import { UpdateBankAccountDto } from './dto/update-account';
import { AccountMessages } from './account.assets';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  async create(@Body() account: CreateBankAccountDto) {
    await this.accountService.checkAndcreateAccount(account);
    return {
      message: AccountMessages.ACCOUNT_CREATED,
      status: HttpStatus.CREATED,
    };
  }

  @Get('getbyid/:id')
  async get(@Param('id') id: string) {
    const account = await this.accountService.getAccounts({
      _id: id,
    });
    return {
      message: AccountMessages.ACCOUNT_FETCHED,
      status: HttpStatus.OK,
      data: account,
    };
  }

  @Get('getbyemail/:email')
  async getByEmail(@Param('email') email: string) {
    const account = await this.accountService.getAccounts({
      email,
    });
    return {
      message: AccountMessages.ACCOUNT_FETCHED,
      status: HttpStatus.OK,
      data: account,
    };
  }

  @Get('getbyaccountnumber/:accountNumber')
  async getByAccountNumber(@Param('accountNumber') accountNumber: string) {
    const account = await this.accountService.getAccounts({
      accountNumber,
    });
    return {
      message: AccountMessages.ACCOUNT_FETCHED,
      status: HttpStatus.OK,
      data: account,
    };
  }

  @Get('getalluseraccounts/:email')
  async getAllUserAccounts(@Param('email') email: string) {
    const account = await this.accountService.getAllUserAccounts(email);
    return {
      message: AccountMessages.ACCOUNT_FETCHED,
      status: HttpStatus.OK,
      data: account,
    };
  }

  @Patch('updateaccount/:email')
  async updateAccount(
    @Body() account: UpdateBankAccountDto,
    @Param('email') email: string,
  ) {
    await this.accountService.getAccounts({
      email,
    });
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
    await this.accountService.getAccounts({
      email,
    });
    await this.accountService.deleteAccount(email);
    return {
      message: AccountMessages.ACCOUNT_DELETED_SUCCESSFULLY,
      status: HttpStatus.OK,
    };
  }
}
