import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Account extends Document {
  @Prop()
  bankName: string;

  @Prop()
  accountNumber: string;

  @Prop()
  balance: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
