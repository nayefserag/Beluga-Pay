import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from 'src/Schema/account.schema';
import { UserSchema } from 'src/Schema/users.schema';
import { TransactionSchema } from 'src/Schema/transaction.schema';
import { TransactionRepository } from 'src/repos/transaction.repo';
import { AccountRepository } from 'src/repos/account.repo';
import { UserRepository } from 'src/repos/user.repo';

@Module({
  providers: [TransactionService ,TransactionRepository ,AccountRepository , UserRepository ],
  imports: [
    MongooseModule.forFeature([{ name: 'account', schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'transaction', schema: TransactionSchema }]),
  ],
  controllers: [TransactionController]
})
export class TransactionModule {}
