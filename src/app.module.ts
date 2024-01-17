import { Module } from '@nestjs/common';
import { UserModule } from './components/user/user.module';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
  ],
})
export class AppModule {}
