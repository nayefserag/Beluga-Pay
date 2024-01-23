import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  HttpException,
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
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
@Controller('bills')
@ApiTags('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new bill' })
  @ApiResponse({ status: 201, description: 'Bill successfully created.' })
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
  @ApiResponse({ status: 200, description: 'List of bills.' })
  @ApiBody({ type: SearchBillsDto })
  async findAll(@Body() filter: SearchBillsDto) {
    const { customerAccountNumber, customerPhone } = filter;

    if (!customerAccountNumber && !customerPhone) {
      throw new HttpException(
        BillMessages.ERROR_FILTER,
        HttpStatus.BAD_REQUEST,
      );
    }
    const bills = await this.billsService.findAll(filter);

    return {
      message: BillMessages.YOUR_BILLS,
      status: HttpStatus.OK,
      bills: bills,
    };
  }

  @Get('/:billId')
  @ApiOperation({ summary: 'Find a bill by ID' })
  @ApiResponse({ status: 200, description: 'Details of the bill.' })
  @ApiParam({ name: 'billId', description: 'ID of the bill' })
  findOne(@Param('billId') billId: string) {
    const valid = isValidObjectID(billId);
    if (!valid) {
      throw new HttpException(BillMessages.INVALID_ID, HttpStatus.BAD_REQUEST);
    }
    const bill = this.billsService.findOne(billId);
    return {
      message: BillMessages.YOUR_BILL,
      status: HttpStatus.OK,
      bills: bill,
    };
  }

  @Patch('payBill/:id')
  @ApiOperation({ summary: 'Pay a bill' })
  @ApiResponse({ status: 200, description: 'Bill payment success.' })
  @ApiParam({ name: 'id', description: 'ID of the bill to be paid' })
  @ApiBody({ type: String, description: 'Account ID for payment' })
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
