import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsISO8601,
  IsIn,
  Length,
} from 'class-validator';
import { formatISO } from 'date-fns';

export class TransactionViaAccountNumberDto {
  _id!: string;

  @ApiProperty({
    description: 'Transaction via',
    type: String,
    example: 'Account Number',
  })
  via: string = 'Account Number';

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
  @IsString()
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  date: string = formatISO(new Date());

  @ApiProperty({
    description: 'Account number associated with the transaction',
    type: String,
    example: '1234567891234567',
  })
  @IsString()
  @IsNotEmpty()
  @Length(16, 16, { message: 'Account number must be exactly 16 digits long' })
  sender!: string;

  @ApiProperty({
    description: 'Account number associated with the transaction',
    type: String,
    example: '1234567891234567',
  })
  @IsString()
  @IsNotEmpty()
  @Length(16, 16, { message: 'Account number must be exactly 16 digits long' })
  receiver!: string;

  @ApiProperty({
    description: 'Transaction status',
    type: String,
    example: 'pending',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'accepted', 'rejected'], {
    message: 'Status must be either pending, accepted, or rejected',
  })
  status!: string;
}
