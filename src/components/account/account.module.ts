import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from 'src/repos/account.repo';
import { AccountSchema } from 'src/Schema/account.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/Schema/users.schema';
import { UserRepository } from 'src/repos/user.repo';

@Module({
  providers: [AccountService, AccountRepository,UserRepository],
  imports: [
    MongooseModule.forFeature([{ name: 'account', schema: AccountSchema }]),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
  ],
  controllers: [AccountController],
})
export class AccountModule {}
