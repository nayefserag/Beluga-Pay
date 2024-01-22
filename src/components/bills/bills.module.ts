import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BillSchema } from 'src/Schema/bill.schema';
import { BillRepository } from 'src/repos/bill.repo';
import { AccountRepository } from 'src/repos/account.repo';
import { AccountSchema } from 'src/Schema/account.schema';
import { TransactionSchema } from 'src/Schema/transaction.schema';
import { UserSchema } from 'src/Schema/users.schema';
import { UserRepository } from 'src/repos/user.repo';
import { TransactionRepository } from 'src/repos/transaction.repo';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: 'bill', schema: BillSchema }]),
    MongooseModule.forFeature([{ name: 'account', schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'transaction', schema: TransactionSchema }]),

  ],
  controllers: [BillsController],
  providers: [BillsService , BillRepository,AccountRepository , UserRepository, TransactionRepository],
})
export class BillsModule {}
