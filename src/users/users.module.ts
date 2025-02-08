import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { UserInfo } from './user-info.entity';
import { Promotion } from '../promotions/promotion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserInfo, Promotion])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {} 