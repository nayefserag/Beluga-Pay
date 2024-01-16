import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

}
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  password: string;
}

export class UserPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsEmail()
  email: string;
}

export class Email {
  @IsEmail()
  @IsEmail()
  email: string;
}
