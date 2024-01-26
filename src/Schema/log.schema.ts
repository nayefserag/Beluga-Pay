import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Log {
  @Prop()
  message!: string;

  @Prop()
  statusCode!: number;

  @Prop()
  method!: string;

  @Prop()
  path!: string;

  @Prop()
  timestamp!: Date;
}

export const LogSchema = SchemaFactory.createForClass(Log);
