import { Controller, Get, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordLogin() {
    return { message: 'Redirecting to Discord...' };
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordCallback(@Req() req) {
    console.log('Discord callback user data:', req.user);
    const token = await this.authService.validateUser(req.user);
    return { access_token: token };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Req() req) {
    console.log('JWT payload:', req.user);
    const user = await this.authService.getUser(req.user.id);
    console.log('Found user:', user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      snowflake: user.snowflake,
      discordUsername: user.discordUsername,
      global_name: user.global_name
    };
  }
}