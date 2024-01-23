import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateBankAccountDto {
  @ApiProperty({
    required: false,
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email!: string;

  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
  })
  @MinLength(3)
  @IsString()
  @IsOptional()
  customerName!: string;

  @ApiProperty({ description: 'Balance', example: 1000 })
  @IsPositive()
  @IsNumber()
  @IsOptional()
  balance!: number;

  @ApiProperty({
    description: 'Phone number',
    example: '+201234567890',
  })
  @IsPhoneNumber('EG', { message: 'Invalid Egyptian phone number format' })
  @IsOptional()
  phoneNumber!: string;
}
