import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { isValidObjectID } from '../../helpers/idValidator';
import { SearchBillsDto } from './dto/search-bill.dto';
import { BillMessages } from './bill.assets';
import { AccountMessages } from '../account/account.assets';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Bill } from 'src/Schema/bill.schema';
import { PaginationDto } from 'src/options/pagination.dto';
@Controller('bills')
@ApiTags('Bills CRUD')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new bill' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Bill successfully created.',
    type: Bill,
  })
  @ApiBadRequestResponse({ description: 'Bad Request', status: 400 })
  @ApiBody({ type: CreateBillDto })
  async create(@Body() createBillDto: CreateBillDto) {
    const bill = await this.billsService.create(createBillDto);
    return {
      message: BillMessages.BILL_CREATED,
      status: HttpStatus.CREATED,
      data: bill,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Find all bills based on filter' })
  @ApiOkResponse({ status: 200, description: 'List of bills.', type: [Bill] })
  @ApiBadRequestResponse({ description: 'Bad Request', status: 400 })
  @ApiQuery({ name: 'customerAccountNumber', required: false, type: String })
  @ApiQuery({ name: 'customerPhone', required: false, type: String })
  async findAll(
    @Query() filter: SearchBillsDto,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const options: PaginationDto = { page, limit };
    const { customerAccountNumber, customerPhone } = filter;

    if (!customerAccountNumber && !customerPhone) {
      throw new HttpException(
        BillMessages.ERROR_FILTER,
        HttpStatus.BAD_REQUEST,
      );
    }
    const bills = await this.billsService.findAll(filter, options);

    return {
      message: BillMessages.YOUR_BILLS,
      status: HttpStatus.OK,
      bills: bills,
    };
  }

  @Get('/:billId')
  @ApiOperation({ summary: 'Find a bill by ID' })
  @ApiOkResponse({
    status: 200,
    description: 'Details of the bill.',
    type: Bill,
  })
  @ApiBadRequestResponse({ description: 'Invalid Bill ID', status: 400 })
  @ApiParam({ name: 'billId', description: 'ID of the bill', type: String })
  async findOne(@Param('billId') billId: string) {
    const valid = isValidObjectID(billId);
    if (!valid) {
      throw new HttpException(BillMessages.INVALID_ID, HttpStatus.BAD_REQUEST);
    }
    const bill = await this.billsService.findOne(billId);
    return {
      message: BillMessages.YOUR_BILL,
      status: HttpStatus.OK,
      bills: bill,
    };
  }

  @Patch('payBill/:id')
  @ApiOperation({ summary: 'Pay a bill' })
  @ApiOkResponse({
    status: 200,
    description: 'Bill payment success.',
    type: Bill,
  })
  @ApiBadRequestResponse({
    description: 'Invalid Bill ID or Account ID',
    status: 400,
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the bill to be paid',
    type: String,
  })
  @ApiBody({
    description: 'Account ID for payment',
    type: Bill ,
    schema: {
      type: 'object',
      properties: {
        accountId: {
          type: 'string',
          description: 'Account ID for the payment',
        },
      },
    },
    examples: {
      example1: {
        value: {
          accountId: '12345',
        
        }
      }
    }
  })
  async payBill(@Param('id') id: string, @Body('accountId') accountId: string) {
    const validBill = isValidObjectID(id);
    if (!validBill) {
      throw new HttpException(BillMessages.INVALID_ID, HttpStatus.BAD_REQUEST);
    }
    const validAccountId = isValidObjectID(accountId);
    if (!validAccountId) {
      throw new HttpException(
        AccountMessages.INVALID_OBJECT_ID,
        HttpStatus.BAD_REQUEST,
      );
    }
    const payedBill = await this.billsService.pay(id, accountId);
    return {
      message: BillMessages.SUCCESS,
      status: HttpStatus.OK,
      bill: payedBill,
    };
  }
}
