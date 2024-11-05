import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.signup(email, password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    const token = await this.authService.validateUser(email, password);
    return { accessToken: token };
  }
  
}
