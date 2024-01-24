import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Bill {
  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true })
  customerName!: string;

  @Prop({
    required: true,
    enum: ['phone', 'accountNumber'],
  })
  paymentMethod!: string;

  @Prop({ required: false })
  customerAccountNumber!: string;

  @Prop({ required: false })
  customerPhone!: string;

  @Prop({ required: true })
  invoiceNumber!: string;

  @Prop({ required: true, default: Date.now() })
  invoiceDate!: Date;

  @Prop({ default: false })
  isPaid!: boolean;

  @Prop()
  paymentDate!: Date;
}

export type BillFromDb = Bill & {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export const BillSchema = SchemaFactory.createForClass(Bill);
