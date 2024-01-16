import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Email, UpdateUserDto, UserDto } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserMessages } from 'src/aassets/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() user: UserDto) {
    try {
      const newUser = await this.userService.checkAndCreateUser(user);
      return {
        message: 'User created successfully',
        status: HttpStatus.CREATED,
        data: newUser,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.CONFLICT);
    }
  }

  @Get('getuser')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getUser(@Body() data: Email) {
    try {
      const user = await this.userService.getUser(data.email);
      if (!user) {
        throw new Error(UserMessages.USER_NOT_FOUND);
      }
      return {
        message: UserMessages.USER_FETCHED,
        status: HttpStatus.OK,
        data: user,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('update')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateUser(@Body() user: UpdateUserDto) {
    try {
        
    }
    catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
