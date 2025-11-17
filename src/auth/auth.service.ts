import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async register() {
    return 'this is register service';
  }
}
