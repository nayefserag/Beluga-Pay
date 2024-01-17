import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsISO8601,
  IsEmail,
} from 'class-validator';

export class TransactionDto {
  @ApiProperty({
    description: 'Transaction description',
    type: String,
    example: 'Payment for goods',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Transaction amount',
    type: Number,
    example: 50.0,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Transaction date',
    type: String,
    example: '2024-01-17T12:00:00Z',
  })
  @IsString()
  @IsISO8601({ strict: true })
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    required: true,
    description: 'The email address to update',
    example: 'nayfserag@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email_sender: string;

  @ApiProperty({
    required: true,
    description: 'The email address to update',
    example: 'jane.doe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email_reciver: string;
}
