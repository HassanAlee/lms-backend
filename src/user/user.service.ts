import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RegisterUserDto } from 'src/auth/dtos/register-user.dto';
import { UpdateUserDto } from 'src/auth/dtos/update-user.dto';
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
  public async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
  public async update(updateUserDto: UpdateUserDto, userId: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      Object.assign(user, updateUserDto);
      await user.save();
      return {
        success: true,
        message: 'User updated successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        error.message ?? 'Something went wrong',
      );
    }
  }
}
