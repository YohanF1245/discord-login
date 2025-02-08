import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Promotion } from '../promotions/promotion.entity';

@Entity('users_infos')
export class UserInfo {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 255 })
  email: string;

  @OneToOne(() => User, user => user.userInfo)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Promotion, promotion => promotion.users)
  @JoinColumn({ name: 'promotion_uuid' })
  promotion: Promotion;
} 