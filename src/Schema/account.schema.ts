import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema()
export class Account {
  @Prop({ required: true })
  email!: string;

  @Prop({ required: true, minlength: 3 })
  customerName!: string;

  @Prop({ required: true, enum: ['savings', 'current'] })
  accountType!: 'savings' | 'current';

  @Prop({ default: 'Beluga' })
  bankName!: string;

  @Prop({ required: true, unique: true })
  accountNumber!: string;

  @Prop({ required: true, min: 0 })
  balance!: number;

  @Prop()
  phoneNumber!: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
