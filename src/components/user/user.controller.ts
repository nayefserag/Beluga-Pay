import { Body, Controller, Post, Res, UsePipes, ValidationPipe  } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
 constructor(private readonly userService: UserService) {

     
 }
    @Post('create')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // read about it don't forget
    async create(@Body() user: UserDto ,@Res() res:Response) {
        const exist = await this.userService.getUser(user.email);
        if (exist){
            return res.json({message: 'User already exists', status: 409}).status(409);
        }
        const newuser = this.userService.createUser(user);
        return res.status(201).json({message: 'User created successfully' , status: 201 , data: newuser});
        
    }


}
