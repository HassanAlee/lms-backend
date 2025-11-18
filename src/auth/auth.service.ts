import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos/login-user.dto';

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
  async login(loginUserDto: LoginUserDto) {
    const user = (
      await this.userService.findUserByEmail(loginUserDto.email)
    ).toObject();
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordCorrect = await bcrypt.compareSync(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid credentials');
    }
    const payload = {
      sub: user._id,
      username: `${user.firstName} ${user.lastName}`,
      email: user.email,
    };
    const access_token = await this.jwtService.signAsync(payload);
    delete user.password;
    return {
      success: true,
      message: 'Logged in successfully',
      data: { ...user, access_token },
    };
  }
}
