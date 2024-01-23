import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Account } from './account.schema';

@Schema()
export class User {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Account' }] }) // Reference schema
  accounts: Account[] = [];
  // @Prop({ type: [{ type: AccountSchema }] }) // Embedded schema
  // accounts: Account[];
}

export const UserSchema = SchemaFactory.createForClass(User);
