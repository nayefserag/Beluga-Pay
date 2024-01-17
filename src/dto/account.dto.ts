import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from 'class-validator';
import { TransactionDto } from './transaction.dto';
import { Type } from 'class-transformer';

export class BankAccountDto {
  @ApiProperty({
    description: 'The bank name',
    type: String,
    example: 'Bank of Example',
  })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty({
    description: 'The account number',
    type: String,
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ description: 'Balance', type: Number, example: '1000$' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  balance: number;
  @ApiProperty({
    description: 'Array of transactions',
    type: [TransactionDto], 
    example: [
      {
        description: 'Transaction description',
        amount : 500,
        date : '2024-01-17T12:00:00Z',
        email_sender : 'nayfserag@gmail.com',
        email_reciver : 'john.doe@example.com'
      },
    ],
  })
  transactions: TransactionDto[];
}
