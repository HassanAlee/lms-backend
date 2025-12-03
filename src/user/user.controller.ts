import { Body, Controller, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from 'src/auth/dtos/update-user.dto';
import { User } from 'decorators/user.decorator';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Patch()
  //   todo: this should support image update as well
  public update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: { sub: Types.ObjectId },
  ) {
    return this.userService.update(updateUserDto, user.sub);
  }
}
