import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsPhoneNumber,
  IsIn,
} from 'class-validator';
import { formatISO } from 'date-fns';

export class TransactionViaPhoneDto {
  _id!: string;

  @ApiProperty({
    description: 'Transaction via',
    type: String,
    example: 'Phone',
  })
  via: string = 'Phone';

  @ApiProperty({
    description: 'Transaction description',
    type: String,
    example: 'Payment for goods',
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    description: 'Transaction amount',
    type: Number,
    example: 50,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({
    description: 'Transaction date',
    type: String,
    example: '2024-01-17T12:00:00Z',
  })
  date: string = formatISO(new Date());

  @ApiProperty({
    description: 'Transaction sender',
    type: String,
    example: '1234567890',
  })
  @IsPhoneNumber('EG')
  sender!: string;

  @ApiProperty({
    description: 'Transaction receiver',
    type: String,
    example: '1234567890',
  })
  @IsPhoneNumber('EG')
  receiver!: string;

  @ApiProperty({
    description: 'Transaction status',
    type: String,
    example: 'pending',
  })
  @IsIn(['pending', 'accepted', 'rejected'], {
    message: 'Status must be either pending, accepted, or rejected',
  })
  status: string = 'pending';
}
