import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/Schema/users.schema';
import { UserRepository } from 'src/repos/user.repo';

@Module({
  controllers: [UserController],
  imports: [MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])],
  providers: [UserService, UserRepository],
})
export class UserModule {}
