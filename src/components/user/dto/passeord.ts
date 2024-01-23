import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

export class UserPasswordDto {
  @ApiProperty({
    required: true,
    description: 'The password of the user',
    example: 'StrongP@ssw0rd!',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password!: string;

  @ApiProperty({
    required: true,
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email!: string;
}
