import { Body, Controller, Post, UsePipes, ValidationPipe  } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
 constructor(private readonly userService: UserService) {

     
 }
    @Post('create')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) // read about it don't forget
    create(@Body() user: UserDto , res:Response) {
        const exist = this.userService.getUser(user.email);
        if (exist){
            return res.status(409).json({message: 'User already exists'});
        }
        const newuser = this.userService.createUser(user);
        res.status(201).json({message: 'User created successfully' , status: 201 , data: newuser});
        
    }


}
