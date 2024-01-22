import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserMessages } from 'src/components/user/user.assets';
import {
  EmailDto,
  UpdateUserDto,
  UserDto,
} from 'src/components/user/dto/user.dto';
import { UserService } from './user.service';
import { HttpException } from '@nestjs/common';

@ApiTags('User CRUD Operations ')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiCreatedResponse({ description: 'User created successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async create(@Body() user: UserDto) {
    const newUser = await this.userService.checkAndCreateUser(user);
    return {
      message: UserMessages.USER_CREATED,
      status: HttpStatus.CREATED,
      data: newUser,
    };
  }

  @Get('getuser')
  @ApiOkResponse({ description: 'User fetched successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUser(@Body() data: EmailDto) {
    const user = await this.userService.getUser(data.email);
    if (!user) {
      throw new HttpException(
        UserMessages.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      message: UserMessages.USER_FETCHED,
      status: HttpStatus.OK,
      data: user,
    };
  }

  @Patch('updateuser')
  @ApiOkResponse({ description: 'User updated successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async updateUser(@Body() user: UpdateUserDto) {
    await this.userService.getUser(user.email);
    const updatedUser = await this.userService.updateUser(user);
    return {
      message: UserMessages.USER_UPDATED,
      status: HttpStatus.OK,
      data: updatedUser,
    };
  }

  @Delete('deleteuser')
  @ApiOkResponse({ description: 'User deleted successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async deleteUser(@Body() data: EmailDto) {
    await this.userService.getUser(data.email);
    await this.userService.deleteUser(data.email);
    return {
      message: UserMessages.USER_DELETED,
      status: HttpStatus.OK,
    };
  }
}
