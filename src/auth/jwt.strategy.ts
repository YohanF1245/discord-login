import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Payload:', payload);
    if (!payload.id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.authService.getUser(payload.id);
    console.log('JWT Strategy - Found user:', user);
    
    if (!user) {
      throw new UnauthorizedException('User not found in JWT strategy');
    }

    return { id: payload.id };
  }
} 