import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TransactionSchema } from '../../Schema/transaction.schema';
import { AccountSchema } from '../../Schema/account.schema';
import { UserSchema } from '../../Schema/users.schema';
import { AccountRepository } from '../../repos/account.repo';
import { UserRepository } from '../../repos/user.repo';
import { TransactionRepository } from '../../repos/transaction.repo';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [
    AccountService,
    AccountRepository,
    UserRepository,
    TransactionRepository,
  ],
  imports: [
    MongooseModule.forFeature([{ name: 'account', schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: 'transaction', schema: TransactionSchema },
    ]),
  ],
  controllers: [AccountController],
})
export class AccountModule {}
