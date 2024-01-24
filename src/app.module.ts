import { Module } from '@nestjs/common';
import { UserModule } from './components/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionModule } from './components/transaction/transaction.module';
import { AccountModule } from './components/account/account.module';
import { BillsModule } from './components/bills/bills.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './loging/loging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    TransactionModule,
    AccountModule,
    BillsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
