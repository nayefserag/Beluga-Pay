import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { BankAccountDto } from './account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  async create(@Body() account: BankAccountDto) {
    await this.accountService.createAccount(account);
    return {
      message: 'Account created successfully',
      status: HttpStatus.CREATED,
    };
  }
}
