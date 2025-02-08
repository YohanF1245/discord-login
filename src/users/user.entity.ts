import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm';
import { UserInfo } from './user-info.entity';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'bigint' })
  snowflake: string;

  @Column({ length: 255 })
  discordUsername: string;

  @Column({ default: false })
  isVerified: boolean;

  @OneToOne(() => UserInfo, userInfo => userInfo.user)
  userInfo: UserInfo;
} 