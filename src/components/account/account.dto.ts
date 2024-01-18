import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { TransactionDto } from '../transaction/transaction.dto';

export class BankAccountDto {
  @ApiProperty({
    description: 'The bank name',
    type: String,
    example: 'CIB',
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
        amount: 500,
        date: '2024-01-17T12:00:00Z',
        sender: 'nayfserag@gmail.com',
        receiver: 'john.doe@example.com',
      },
    ],
  })
  transactions: TransactionDto[];
}
