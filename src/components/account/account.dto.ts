import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { TransactionDto } from '../transaction/transaction.dto';

export class BankAccountDto {
  @ApiProperty({
    required: true,
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The bank name',
    type: String,
    example: 'CIB',
  })
  @Length(2, 50)
  @IsString()
  bankName: string;

  @ApiProperty({
    description: 'The account number',
    type: String,
    example: '1234567890',
  })
  @Matches(/^\d{16}$/, { message: 'Account number must be a 16-digit number' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ description: 'Balance', type: Number, example: '1000$' })
  @IsPositive()
  @IsNumber()
  balance: number;

  @ApiProperty({
    description: 'Array of transactions',
    type: [TransactionDto],
    example: [
      {
        description: 'Transaction description',
        amount: 500,
        date: '2024-01-18T12:00:00Z',
        sender: 'nayfserag@gmail.com',
        receiver: 'john.doe@example.com',
      },
    ],
  })
  transactions: TransactionDto[];
}
