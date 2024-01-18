import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { TransactionDto } from '../transaction/transaction.dto';

export class BankAccountDto {
  @ApiProperty({
    required: true,
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(3)
  customerName: string;

  @ApiProperty({
    description: 'Account type (savings or current)',
    example: 'savings',
    enum: ['savings', 'current'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['savings', 'current'], {
    message: 'Invalid account type. Must be either "savings" or "current".',
  })
  accountType: 'savings' | 'current';

  @ApiProperty({
    description: 'The bank name',
    example: 'Beluga',
  })
  bankName: string = 'Beluga';

  @ApiProperty({
    description: 'The account number',
    example: '1234567890123456',
  })
  accountNumber: string;

  @ApiProperty({ description: 'Balance', example: 1000 })
  @IsPositive()
  @IsNumber()
  balance: number;

  @ApiProperty({
    description: 'Phone number',
    example: '+201234567890',
  })
  @IsPhoneNumber('EG', { message: 'Invalid Egyptian phone number format' })
  phoneNumber: string;

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

export class UpdateBankAccountDto {
  @ApiProperty({
    required: false,
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
  })
  @MinLength(3)
  @IsString()
  @IsOptional()
  customerName: string;

  @ApiProperty({ description: 'Balance', example: 1000 })
  @IsPositive()
  @IsNumber()
  @IsOptional()
  balance: number;

  @ApiProperty({
    description: 'Phone number',
    example: '+201234567890',
  })
  @IsPhoneNumber('EG', { message: 'Invalid Egyptian phone number format' })
  @IsOptional()
  phoneNumber: string;

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