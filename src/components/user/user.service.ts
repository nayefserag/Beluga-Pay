import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserMessages } from 'src/aassets/user';
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

    async checkAndCreateUser(user: UserDto): Promise<UserDto> {
        const exist = await this.userModel.findOne({ email: user.email });
        if (exist) {
            throw new Error(UserMessages.USER_IS_ALREADY_REGISTERED);
        }
        const newUser = await this.userModel.create(user);
        return newUser;
    } 
}
