import {
  Body,
  Controller,
  Delete,
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
        message: UserMessages.USER_CREATED,
        status: HttpStatus.CREATED,
        data: newUser,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.CONFLICT); // need to change
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
  async updateUser(@Body() user: UpdateUserDto  , @Body() data: Email) {
    try {
      const existing = await this.userService.getUser(data.email); // don't forget to test this and try a way to remove this line to make check if it exist without this line
      const updatedUser = await this.userService.updateUser(user);
      return {
        message: UserMessages.USER_UPDATED,
        status: HttpStatus.OK,
        data: updatedUser
      }
    }
    catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST); // need to change
    }
  }

  @Delete('deleteuser')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async deleteUser(@Body() data: Email) {
    try {
      const existing = await this.userService.getUser(data.email);
      const deletedUser = await this.userService.deleteUser(data.email);
      return {
        message: UserMessages.USER_DELETED,
        status: HttpStatus.OK,
        data: deletedUser
      }
    }
    catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST); // need to change
    }
  }
}
