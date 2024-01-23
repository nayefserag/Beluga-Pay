import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsBoolean,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
  IsIn,
  ValidateIf,
  Length,
  Matches,
  Max,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateBillDto {
  _id!: string;

  @ApiProperty({
    description: 'Bill amount',
    example: 100,
  })
  @Min(10)
  @Max(10000)
  amount!: number;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(3)
  customerName!: string;

  @ApiProperty({
    description: 'Transaction via',
    type: String,
    example: 'phone',
  })
  @IsIn(['phone', 'accountNumber'])
  paymentMethod!: 'phone' | 'accountNumber';

  @ApiProperty({
    description: 'The account number',
    example: '1234567890123456',
  })
  @Length(16, 16)
  @Matches(/^\d{16}$/, {
    message: 'Account number must be 16 digits',
  })
  @ValidateIf((obj, value) => obj.paymentMethod === 'accountNumber')
  customerAccountNumber!: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+201234567890',
  })
  @IsPhoneNumber('EG', { message: 'Invalid Egyptian phone number format' })
  @IsNotEmpty()
  @ValidateIf((obj, value) => obj.paymentMethod === 'phone')
  customerPhone!: string;

  @ApiProperty({
    description: 'The account number',
    example: '1234567890123456',
  })
  invoiceNumber!: string;

  @IsDate()
  @IsOptional()
  invoiceDate!: Date;

  @IsBoolean()
  isPaid: boolean = false;

  @IsDate()
  @IsOptional()
  paymentDate?: Date;
}
