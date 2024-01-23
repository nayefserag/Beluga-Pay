import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from '../../Schema/transaction.schema';
import { AccountSchema } from '../../Schema/account.schema';
import { UserSchema } from '../../Schema/users.schema';
import { TransactionRepository } from '../../repos/transaction.repo';
import { AccountRepository } from '../../repos/account.repo';
import { UserRepository } from '../../repos/user.repo';

@Module({
  providers: [
    TransactionService,
    TransactionRepository,
    AccountRepository,
    UserRepository,
  ],
  imports: [
    MongooseModule.forFeature([{ name: 'account', schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'transaction', schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
