import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDate,
  IsBoolean,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateBillDto {
  _id:string

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(3)
  customerName: string;

  @ApiProperty({
    description: 'Transaction via',
    type: String,
    example: 'phone',
  })
  paymentMethod: 'phone' | 'accountNumber';

  @ApiProperty({
    description: 'The account number',
    example: '1234567890123456',
  })
  customerAccountNumber: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+201234567890',
  })
  @IsPhoneNumber('EG', { message: 'Invalid Egyptian phone number format' })
  customerPhone: string;

  @ApiProperty({
    description: 'The account number',
    example: '1234567890123456',
  })
  @IsNotEmpty()
  invoiceNumber: string;

  @IsDate()
  @IsOptional()
  invoiceDate: Date;

  @IsBoolean({})
  isPaid: boolean = false;
  
  @IsDate()
  @IsOptional()
  paymentDate?: Date;
}
