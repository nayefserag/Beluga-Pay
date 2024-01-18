import { Module } from '@nestjs/common';
import { UserModule } from './components/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './components/transaction/transaction.module';
import { AccountModule } from './components/account/account.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    TransactionModule,
    AccountModule,
  ],
})
export class AppModule {}
