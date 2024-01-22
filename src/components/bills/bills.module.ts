import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BillSchema } from 'src/Schema/bill.schema';
import { BillRepository } from 'src/repos/bill.repo';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: 'bill', schema: BillSchema }]),

  ],
  controllers: [BillsController],
  providers: [BillsService , BillRepository],
})
export class BillsModule {}
