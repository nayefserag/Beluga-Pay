import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { CreateUserDto } from './create-user';

export class EmailDto extends PickType(CreateUserDto, ['email']) {}
