import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { BillRepository } from '../../repos/bill.repo';
import { AccountRepository } from '../../repos/account.repo';
import { generator } from '../../helpers/numbergenerator';
import { BillMessages } from '../bills/bill.assets';
import { AccountMessages } from '../account/account.assets';
import { SearchBillsDto } from './dto/search-bill.dto';

@Injectable()
export class BillsService {
  constructor(
    private readonly billrepo: BillRepository,
    private readonly accountrepo: AccountRepository,
  ) {}
  async create(createBillDto: CreateBillDto): Promise<CreateBillDto> {
    createBillDto.invoiceNumber = generator('Inovice Number');
    const newBill = await this.billrepo.createBill(createBillDto);
    if (!newBill) {
      throw new HttpException(
        BillMessages.BILL_NOT_CREATED,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newBill;
  }

  async findAll(filter: SearchBillsDto): Promise<UpdateBillDto[]> {
    const bills = await this.billrepo.getAllBillsForUser(filter);
    if (bills.length == 0) {
      throw new HttpException(BillMessages.NO_BILLS, HttpStatus.NOT_FOUND);
    }
    return bills;
  }

  async findOne(id: string): Promise<UpdateBillDto> {
    const bill = await this.billrepo.getBillById(id);
    if (!bill) {
      throw new HttpException(BillMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return bill;
  }

  async update(
    id: string,
    updateBillDto: UpdateBillDto,
  ): Promise<UpdateBillDto> {
    const updatedBill = await this.billrepo.updateBill(id, updateBillDto);
    if (!updatedBill) {
      throw new HttpException(BillMessages.NOT_UPDATED, HttpStatus.BAD_REQUEST);
    }
    return updatedBill;
  }
  async pay(id: string, accountId: string): Promise<UpdateBillDto> {
    const account = await this.accountrepo.getBy({ _id: accountId });
    if (!account) {
      throw new HttpException(
        AccountMessages.ACCOUNT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    const bill = await this.billrepo.getBillById(id);
    if (!bill) {
      throw new HttpException(BillMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.accountrepo.checkEnough(account.balance, bill.amount);
    account.balance -= bill.amount;
    bill.isPaid = true;
    await this.accountrepo.updateAccount(account, account.email);
    const payedBill = await this.update(id, bill);
    return payedBill;
  }
}
