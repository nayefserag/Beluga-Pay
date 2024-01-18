import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Account } from './account.schema';

@Schema()
export class Transaction extends Document {
  @Prop()
  description: string;

  @Prop()
  method: string;

  @Prop()
  amount: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Account' })
  sender: Account;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Account' })
  receiver: Account;

  @Prop()
  status: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
