import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user';

export class EmailDto extends PickType(CreateUserDto, ['email']) {}
