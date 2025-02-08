import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserInfo } from './user-info.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Promotion } from '../promotions/promotion.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
    @InjectRepository(Promotion)
    private promotionsRepository: Repository<Promotion>,
  ) {}

  async findOne(snowflake: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { snowflake },
      relations: ['userInfo', 'userInfo.promotion'],
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  async updateProfile(snowflake: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { snowflake },
      relations: ['userInfo'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    let userInfo = user.userInfo;
    if (!userInfo) {
      userInfo = this.userInfoRepository.create();
      userInfo.user = user;
    }

    userInfo.firstName = updateProfileDto.firstName;
    userInfo.lastName = updateProfileDto.lastName;
    userInfo.email = updateProfileDto.email;

    if (updateProfileDto.promotionUuid) {
      const promotion = await this.promotionsRepository.findOne({
        where: { uuid: updateProfileDto.promotionUuid },
      });
      if (!promotion) {
        throw new BadRequestException('Promotion non trouvée');
      }
      userInfo.promotion = promotion;
    }

    await this.userInfoRepository.save(userInfo);
    return this.findOne(snowflake);
  }

  async verifyUser(snowflake: string): Promise<User> {
    const user = await this.findOne(snowflake);
    user.isVerified = true;
    return this.usersRepository.save(user);
  }
} 