import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Email, UpdateUserDto, UserDto } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { HttpStatus } from '@nestjs/common';
import { UserMessages } from 'src/aassets/user';

@ApiTags('User CRUD Operations ')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiCreatedResponse({ description: 'User created successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async create(@Body() user: UserDto) {
    try {
      const newUser = await this.userService.checkAndCreateUser(user);
      return {
        message: UserMessages.USER_CREATED,
        status: HttpStatus.CREATED,
        data: newUser,
      };
    } catch (error) {
      return {
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Get('getuser')
  @ApiOkResponse({ description: 'User fetched successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'User not found' })
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
    } catch (error) {
      return {
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Patch('updateuser')
  @ApiOkResponse({ description: 'User updated successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async updateUser(@Body() user: UpdateUserDto) {
    try {
      await this.userService.getUser(user.email);
      const updatedUser = await this.userService.updateUser(user);
      return {
        message: UserMessages.USER_UPDATED,
        status: HttpStatus.OK,
        data: updatedUser,
      };
    } catch (error) {
      return {
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Delete('deleteuser')
  @ApiOkResponse({ description: 'User deleted successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async deleteUser(@Body() data: Email) {
    try {
      await this.userService.getUser(data.email);
      await this.userService.deleteUser(data.email);
      return {
        message: UserMessages.USER_DELETED,
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: error.message,
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
