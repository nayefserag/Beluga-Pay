import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Bill, BillFromDb as BillDocument } from '../Schema/bill.schema';
import { constructObjId } from 'src/helpers/idValidator';
import { PaginationDto } from 'src/options/pagination.dto';
@Injectable()
export class BillRepository {
  constructor(@InjectModel('bill') private billModel: Model<Bill>) {}

  async createBill(bill: Partial<Bill>): Promise<Bill> {
    return await this.billModel.create(bill);
  }

  async updateBill(
    id: string,
    bill: UpdateQuery<Bill>,
  ): Promise<BillDocument | null> {
    const updatedBill = await this.billModel.findOneAndUpdate<BillDocument>(
      { _id: constructObjId(id) },
      bill,
      { new: true },
    );
    return updatedBill;
  }

  async getBillById(_id: string): Promise<BillDocument | null> {
    const billTransaction = await this.billModel
      .findById<BillDocument>(_id)
      .exec();
    return billTransaction;
  }

  async getAllBillsForUser(filter: FilterQuery<BillDocument>, options: PaginationDto) {
    const { limit, page } = options;
    const skip = (page - 1) * limit;
    const bills = await this.billModel.find<Bill>(filter).limit(limit).skip(skip).exec();
    return bills;
  }
}
