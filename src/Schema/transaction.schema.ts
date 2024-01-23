import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Transaction {
  @Prop({ required: false })
  via!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, type: Number, min: 0 })
  amount!: number;

  @Prop({ type: Date, default: Date.now, required: true })
  date!: Date;

  @Prop({ required: true })
  sender!: string;

  @Prop({ required: true })
  receiver!: string;

  @Prop({
    required: false,
    enum: ['pending', 'accepted', 'rejected'],
  })
  status!: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
