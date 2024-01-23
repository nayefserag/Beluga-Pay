import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsStrongPassword,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    required: true,
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: true,
    description: 'The password of the user',
    example: 'StrongP@ssw0rd!',
    minLength: 8,
  })
  @IsString()
  @IsStrongPassword()
  password!: string;

  @ApiProperty({
    required: false,
    description: 'List of bank account IDs',
  })
  @IsOptional()
  @IsArray()
  accounts!: string[];
}
