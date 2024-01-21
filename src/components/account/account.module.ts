import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from 'src/repos/account.repo';
import { AccountSchema } from 'src/Schema/account.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/Schema/users.schema';
import { UserRepository } from 'src/repos/user.repo';
import { TransactionRepository } from 'src/repos/transaction.repo';
import { TransactionSchema } from 'src/Schema/transaction.schema';

@Module({
  providers: [AccountService, AccountRepository,UserRepository,TransactionRepository],
  imports: [
    MongooseModule.forFeature([{ name: 'account', schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'transaction', schema: TransactionSchema }]),

  ],
  controllers: [AccountController],
})
export class AccountModule {}
