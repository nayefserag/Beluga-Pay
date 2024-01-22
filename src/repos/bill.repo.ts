import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateBillDto } from 'src/components/bills/dto/create-bill.dto';
import { UpdateBillDto } from 'src/components/bills/dto/update-bill.dto';
@Injectable()
export class BillRepository {
  constructor(@InjectModel('bill') private billModel: Model<CreateBillDto>) {}

  async createBill(bill: CreateBillDto): Promise<CreateBillDto> {
    return await this.billModel.create(bill);
  }

  async updateBill(bill: UpdateBillDto): Promise<UpdateBillDto | null> {
    const updatedBill = await this.billModel.findOneAndUpdate(
      { _id: bill._id },
      bill,
      { new: true },
    );
    return updatedBill;
  }

  async getBillById(id: string): Promise<UpdateBillDto | null> {
    const transaction = await this.billModel.findById(id);
    return transaction;
  }

  async getAllBillsForUser(filter: {
    customerAccountNumber?: string;
    customerPhone: string;
  }): Promise<Array<UpdateBillDto>> {
    const bills = await this.billModel.find({ filter });
    return bills;
  }
}
