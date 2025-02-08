import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserInfo } from '../users/user-info.entity';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'timestamp' })
  startsAt: Date;

  @Column({ type: 'timestamp' })
  endsAt: Date;

  @OneToMany(() => UserInfo, userInfo => userInfo.promotion)
  users: UserInfo[];
} 