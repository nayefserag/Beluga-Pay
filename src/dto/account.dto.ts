import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

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
}
