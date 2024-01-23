import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsStrongPassword,
  IsArray,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    required: false,
    description: 'The new name of the user',
    example: 'Jane Doe',
  })
  @IsOptional()
  @IsString()
  name!: string;

  @ApiProperty({
    required: true,
    description: 'The email address to update',
    example: 'jane.doe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: false,
    description: 'The new password of the user',
    example: 'NewStrongP@ssw0rd!',
    minLength: 8,
  })
  @IsOptional()
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
