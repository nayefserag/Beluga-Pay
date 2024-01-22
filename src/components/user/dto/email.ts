import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailDto {
  @ApiProperty({
    required: true,
    description: 'The email address',
    example: 'example@example.com',
  })
  @IsEmail()
  email: string;
}
