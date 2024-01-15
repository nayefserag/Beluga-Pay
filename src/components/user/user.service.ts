import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class UserService {
    @InjectModel('user') private userModel: Model<UserDto>

    async createUser(user: UserDto): Promise<UserDto> {
    
        const newUser = await this.userModel.create(user);
        return newUser;
    }

    async getUser(email: string): Promise<UserDto> {
        const user = await this.userModel.findOne({ email });
        return user;
    }
}
