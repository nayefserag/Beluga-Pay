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
import { UpdateBillDto } from './dto/update-bill.dto';
import { isValidObjectID } from 'src/helpers/idValidator';
import { SearchBillsDto } from './dto/search-bill.dto';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post('create')
  async create(@Body() createBillDto: CreateBillDto) {
    const bill = await this.billsService.create(createBillDto);
    return {
      message: 'Bill Created Successfully',
      status: HttpStatus.CREATED,
      data: bill,
    };
  }

  @Get('mybills')
  findAll(@Body() filter: SearchBillsDto) {
    const { customerAccountNumber, customerPhone } = filter;

    if (!customerAccountNumber && !customerPhone) {
      throw new HttpException(
        'Please provide at least one of customerPhone or customerAccountNumber',
        HttpStatus.BAD_REQUEST,
      );
    }
    const bills = this.billsService.findAll(filter);

    return {
      message: 'here Is Your Bills ',
      status: HttpStatus.OK,
      bills: bills,
    };
  }

  @Get('bill/:billId')
  findOne(@Param('billId') billId: string) {
    const valid = isValidObjectID(billId);
    if (!valid) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const bill = this.billsService.findOne(billId);
    return {
      message: 'here Is Your Bill ',
      status: HttpStatus.OK,
      bills: bill,
    };
  }

  @Patch('payBill/:id')
  payBill(@Param('id') id: string, @Body() accountId: string) {
    // valid objId Bill
    const validBill = isValidObjectID(id);
    if (!validBill) {
      throw new HttpException('Invalid Bill ID', HttpStatus.BAD_REQUEST);
    }
    const validAccountId = isValidObjectID(accountId);
    if (!validAccountId) {
      throw new HttpException('Invalid Account ID', HttpStatus.BAD_REQUEST);
    }
    const payedBill = this.billsService.pay(id, accountId);
    return {
      message: ' you pay the bill successfully',
      status: HttpStatus.OK,
      bill: payedBill,
    };
  }
}
