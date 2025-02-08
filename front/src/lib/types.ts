export interface DiscordUser {
  snowflake: string;
  discordUsername: string;
  global_name?: string;
  avatar?: string;
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  promotionUuid?: string;
  isVerified: boolean;
}

export interface Promotion {
  uuid: string;
  name: string;
  startsAt: string;
  endsAt: string;
}

export interface UserProfile extends DiscordUser {
  userInfo?: UserInfo;
} 