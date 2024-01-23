import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsPhoneNumber,
  Length,
  Matches,
} from 'class-validator';

export class SearchBillsDto {
  @ApiProperty({
    description: 'Customer account number',
    example: '1234567890123456',
  })
  @IsString()
  @Length(16, 16)
  @Matches(/^\d{16}$/, {
    message: 'Account number must be 16 digits',
  })
  @IsOptional()
  customerAccountNumber?: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+201234567890',
  })
  @IsPhoneNumber('EG', { message: 'Invalid Egyptian phone number format' })
  @IsOptional()
  customerPhone?: string;
}
