import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/Schema/users.schema';


@Module({
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])

  ],
  providers: [UserService]
})
export class UserModule {}
