import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async register(registerUserDto: RegisterUserDto) {
    const hash = await bcrypt.hash(registerUserDto.password, 10);
    const user = await this.userService.register({
      ...registerUserDto,
      password: hash,
    });
    const payload = {
      sub: user.data._id,
      username: `${user.data.firstName} ${user.data.lastName}`,
      email: user.data.email,
    };
    const access_token = await this.jwtService.signAsync(payload);
    // TODO: send a registration confirmtion email
    return { ...user, data: { ...user.data, access_token } };
  }
}
