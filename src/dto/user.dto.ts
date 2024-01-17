import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsStrongPassword,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { BankAccountDto } from './account.dto';
import { Type } from 'class-transformer';

export class UserDto {
  @ApiProperty({
    required: true,
    description: 'The name of the user',
    example: 'John Doe',
  })
  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'The password of the user',
    example: 'StrongP@ssw0rd!',
    minLength: 8,
  })
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    required: false,
    type: [BankAccountDto],
    description: 'List of bank accounts',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankAccountDto)
  accounts: BankAccountDto[];
}

export class UpdateUserDto {
  @ApiProperty({
    required: false,
    description: 'The new name of the user',
    example: 'Jane Doe',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    description: 'The email address to update',
    example: 'jane.doe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: false,
    description: 'The new password of the user',
    example: 'NewStrongP@ssw0rd!',
    minLength: 8,
  })
  @IsOptional()
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    required: false,
    type: [BankAccountDto],
    description: 'List of bank accounts',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankAccountDto)
  accounts: BankAccountDto[];
}

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
  password: string;

  @ApiProperty({
    required: true,
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;
}

export class Email {
  @ApiProperty({
    required: true,
    description: 'The email address',
    example: 'example@example.com',
  })
  @IsEmail()
  email: string;
}
