import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateBillDto } from 'src/components/bills/dto/create-bill.dto';
import { SearchBillsDto } from 'src/components/bills/dto/search-bill.dto';
import { UpdateBillDto } from 'src/components/bills/dto/update-bill.dto';
@Injectable()
export class BillRepository {
  constructor(@InjectModel('bill') private billModel: Model<CreateBillDto>) {}

  async createBill(bill: CreateBillDto): Promise<CreateBillDto> {
    return await this.billModel.create(bill);
  }

  async updateBill(
    id: string,
    bill: UpdateBillDto,
  ): Promise<UpdateBillDto | null> {
    const updatedBill = await this.billModel.findOneAndUpdate(
      { _id: id },
      bill,
      { new: true },
    );
    return updatedBill;
  }

  async getBillById(_id: string): Promise<CreateBillDto | null> {
    const transaction = await this.billModel.findById(_id);
    return transaction;
  }

  async getAllBillsForUser(
    filter: SearchBillsDto,
  ): Promise<Array<UpdateBillDto>> {
    const bills = await this.billModel.find(filter );
    return bills;
  }
}
