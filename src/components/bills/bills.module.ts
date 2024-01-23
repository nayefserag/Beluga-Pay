import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BillRepository } from '../../repos/bill.repo';
import { AccountRepository } from '../../repos/account.repo';
import { UserRepository } from '../../repos/user.repo';
import { TransactionRepository } from '../../repos/transaction.repo';
import { BillSchema } from '../../Schema/bill.schema';
import { AccountSchema } from '../../Schema/account.schema';
import { UserSchema } from '../../Schema/users.schema';
import { TransactionSchema } from '../../Schema/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'bill', schema: BillSchema }]),
    MongooseModule.forFeature([{ name: 'account', schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'transaction', schema: TransactionSchema },
    ]),
  ],
  controllers: [BillsController],
  providers: [
    BillsService,
    BillRepository,
    AccountRepository,
    UserRepository,
    TransactionRepository,
  ],
})
export class BillsModule {}
