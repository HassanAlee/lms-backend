import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from 'src/auth/dtos/register-user.dto';
import { User } from 'src/auth/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  public async register(registerUserDto: RegisterUserDto) {
    try {
      const userDoc = await this.userModel.create(registerUserDto);
      const user = userDoc.toObject();
      delete user.password;
      return {
        success: true,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('E11000 duplicate key error collection')
      ) {
        throw new BadRequestException({
          success: false,
          message: 'Email already exists',
          data: null,
        });
      }
      throw new HttpException(
        {
          data: null,
          success: false,
          message: 'Something went wrong',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      );
    }
  }
}
