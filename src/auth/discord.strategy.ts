import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  private readonly logger = new Logger(DiscordStrategy.name);

  constructor(
    private authService: AuthService,
    configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>('DISCORD_CLIENT_ID'),
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET'),
      callbackURL: configService.get<string>('DISCORD_REDIRECT_URI'),
      scope: ['identify'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    this.logger.debug('Discord profile:', profile);
    
    // Extraire uniquement les données nécessaires
    const userData = {
      id: profile.id,
      username: profile.username,
      discriminator: profile.discriminator,
      avatar: profile.avatar,
      global_name: profile.global_name
    };

    this.logger.debug('Extracted user data:', userData);
    return userData;
  }
}