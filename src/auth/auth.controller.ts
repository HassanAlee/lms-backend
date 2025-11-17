import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  public register(@Body() registerUserDto: RegisterUserDto) {
    console.log('register user dto', registerUserDto);

    return this.authService.register();
  }
}
