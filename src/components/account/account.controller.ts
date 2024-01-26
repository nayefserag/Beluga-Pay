import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateBankAccountDto } from './dto/create-account';
import { UpdateBankAccountDto } from './dto/update-account';
import { AccountMessages } from './account.assets';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/options/pagination.dto';
@ApiTags('Account CRUD')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new bank account for a user', 
    description: 'Creates a new bank account associated with the provided user email. Returns the created account object.'
  })
  @ApiCreatedResponse({ description: 'Bank account created successfully.' ,status: 201})
  @ApiBadRequestResponse({ description: 'Bad request' ,status: 400})
  @ApiConflictResponse({ description: 'Account already exists for this user' ,status: 409})
  @ApiBody({ type: CreateBankAccountDto })
  async create(@Body() account: CreateBankAccountDto) {
    await this.accountService.checkAndcreateAccount(account);
    return {
      message: AccountMessages.ACCOUNT_CREATED,
      status: HttpStatus.CREATED,
    };
  }

  @Get('getbyid/:id')
  @ApiOperation({ summary: 'Get bank account by ID' })
  @ApiOkResponse({
    description: 'Bank account fetched successfully.',
    type: CreateBankAccountDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the bank account' })
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
  @ApiOperation({ summary: 'Get bank account by email' })
  @ApiOkResponse({
    description: 'Bank account fetched successfully.',
    type: CreateBankAccountDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiParam({
    name: 'email',
    type: String,
    description: 'Email associated with the bank account',
  })
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
  @ApiOperation({ summary: 'Get bank account by account number' })
  @ApiOkResponse({
    description: 'Bank account fetched successfully.',
    type: CreateBankAccountDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiParam({
    name: 'accountNumber',
    type: String,
    description: 'Account number of the bank account',
  })
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
  @ApiOperation({ summary: 'Get all bank accounts of a user' })
  @ApiOkResponse({
    description: 'List of bank accounts fetched successfully.',
    type: CreateBankAccountDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiQuery({
    name: 'email',
    type: String,
    description: 'Email of the user to fetch accounts for',
  })
  @ApiQuery({
    name: 'page', 
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Number of items per page',
  })
  async getAllUserAccounts(
    @Param('email') email: string,
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    const options: PaginationDto = { page, limit };
    const account = await this.accountService.getAllUserAccounts(
      email,
      options,
    );
    return {
      message: AccountMessages.ACCOUNT_FETCHED,
      status: HttpStatus.OK,
      data: account,
    };
  }
  @Patch('updateaccount/:email')
  @ApiOperation({ summary: 'Update bank account' })
  @ApiOkResponse({
    description: 'Bank account updated successfully.',
    type: UpdateBankAccountDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiParam({
    name: 'email',
    type: String,
    description: 'Email associated with the bank account to update',
  })
  @ApiBody({ type: UpdateBankAccountDto })
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
  @ApiOperation({ summary: 'Delete bank account' })
  @ApiOkResponse({ description: 'Bank account deleted successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiParam({
    name: 'email',
    type: String,
    description: 'Email associated with the bank account to delete',
  })
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
