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
  ApiParam,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { EmailDto } from './dto/email';
import { UpdateUserDto } from './dto/update-user';
import { CreateUserDto } from './dto/create-user';
import { UserService } from './user.service';
import { HttpException } from '@nestjs/common';
import { UserMessages } from './user.assets';

@ApiTags('User CRUD ')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ 
    summary: 'Create a new user',
    description: 'Creates a new user with the provided information and saves it to the database.' 
  })
  @ApiCreatedResponse({
    description: 'User created successfully.',
    status: 201,
    type: CreateUserDto
  })
  @ApiConflictResponse({ description: 'User already exists', status: 409 })
  @ApiBadRequestResponse({ description: 'Bad request', status: 400 })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      'example1': {
        value: {
          name: 'John',
          email: 'jQn9P@example.com',
          password: 'password'
        }
      },
      'example2': {
        value: {
          name: 'Jane',
          email: 'jQn9P@example.com',
          password: 'password'
        }
      }
    }
  })
  async create(@Body() user: CreateUserDto) {
    const newUser = await this.userService.checkAndCreateUser(user);
    return {
      message: UserMessages.USER_CREATED,
      status: HttpStatus.CREATED,
      data: newUser,
    };
  }

  @Get(':email')
  @ApiOperation({ summary: 'Get User' })
  @ApiOkResponse({ description: 'User fetched successfully.', status: 200 })
  @ApiBadRequestResponse({ description: 'Bad request', status: 400 })
  @ApiNotFoundResponse({ description: 'User not found', status: 404 })
  @ApiParam({
    name: 'email',
    type: String,
    description: 'Email of the user to fetch',
  })
  async getUser(@Param('email') email: string) {
    console.log(email)
    const user = await this.userService.getUser(email);
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
  @ApiOkResponse({ description: 'User updated successfully.', status: 200 ,type: UpdateUserDto})
  @ApiBadRequestResponse({ description: 'Bad request', status: 400 })
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

  @Delete('deleteuser/:email')
  @ApiOperation({ summary: 'Delete User' })
  @ApiOkResponse({ description: 'User deleted successfully.', status: 200 })
  @ApiBadRequestResponse({ description: 'Bad request', status: 400 })
  @ApiNotFoundResponse({ description: 'User not found', status: 404 })
  @ApiParam({
    name: 'email',
    type: String,
    description: 'Email of the user to delete',
  })
  async deleteUser(@Param('email') email: string) {
    await this.userService.getUser(email);
    await this.userService.deleteUser(email);
    return {
      message: UserMessages.USER_DELETED,
      status: HttpStatus.NO_CONTENT,
    };
  }
}
