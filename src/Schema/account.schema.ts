import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Transaction } from './transaction.schema';

@Schema()
export class Account {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: MongooseSchema.Types.ObjectId;

  @Prop()
  bankName: string;

  @Prop()
  accountNumber: string;

  @Prop()
  balance: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Transaction' }] })
  transactions: Transaction[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);
