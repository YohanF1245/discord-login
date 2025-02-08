import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsUUID()
  promotionUuid?: string;
} 