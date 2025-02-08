import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post('verify/:snowflake')
  @UseGuards(AuthGuard('jwt'))
  async verifyUser(@Req() req, @Body('snowflake') snowflake: string) {
    // TODO: Ajouter la vérification des rôles
    return this.usersService.verifyUser(snowflake);
  }
} 