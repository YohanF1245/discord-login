import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserStorage, StoredUser } from './user.storage';

export interface User {
  id: string;          // Discord snowflake
  username: string;    // Discord username
  discriminator?: string;
  avatar: string;
}

export interface UserResponse {
  snowflake: string;
  discordUsername: string;
  global_name?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userStorage: UserStorage,
  ) {}

  async validateUser(profile: any): Promise<string> {
    console.log('Validating user profile:', profile);
    
    const user: StoredUser = {
      id: profile.id,
      username: profile.username,
      discriminator: profile.discriminator,
      avatar: profile.avatar,
      global_name: profile.global_name
    };

    // Sauvegarder l'utilisateur
    this.userStorage.saveUser(user);
    console.log('Saved user:', user);

    return this.jwtService.sign({ id: user.id });
  }

  async getUser(userId: string): Promise<UserResponse | null> {
    console.log('Getting user with ID:', userId);
    
    const user = this.userStorage.getUser(userId);
    console.log('Found user:', user);
    
    if (!user) return null;

    return {
      snowflake: user.id,
      discordUsername: user.username,
      global_name: user.global_name
    };
  }
}

