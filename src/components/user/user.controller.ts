import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam
} from '@nestjs/swagger';
import { EmailDto } from './dto/email';
import { UpdateUserDto } from './dto/update-user';
import { CreateUserDto } from './dto/create-user';
import { UserService } from './user.service';
import { HttpException } from '@nestjs/common';
import { UserMessages } from './user.assets';

@ApiTags('User CRUD Operations ')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create User' })
  @ApiCreatedResponse({ description: 'User created successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBody({ type: CreateUserDto })  
  async create(@Body() user: CreateUserDto) {
    const newUser = await this.userService.checkAndCreateUser(user);
    return {
      message: UserMessages.USER_CREATED,
      status: HttpStatus.CREATED,
      data: newUser,
    };
  }

  @Get('getuser/:email')
  @ApiOperation({ summary: 'Get User' })
  @ApiOkResponse({ description: 'User fetched successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiParam({ name: 'email', type: String, description: 'Email of the user to fetch' })
  async getUser(@Param('email') data: EmailDto) {
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
  @ApiOperation({ summary: 'Update User' })
  @ApiOkResponse({ description: 'User updated successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBody({ type: UpdateUserDto })
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
  @ApiOperation({ summary: 'Delete User' })
  @ApiOkResponse({ description: 'User deleted successfully.' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBody({ type: EmailDto })
  async deleteUser(@Body() data: EmailDto) {
    await this.userService.getUser(data.email);
    await this.userService.deleteUser(data.email);
    return {
      message: UserMessages.USER_DELETED,
      status: HttpStatus.OK,
    };
  }
}
