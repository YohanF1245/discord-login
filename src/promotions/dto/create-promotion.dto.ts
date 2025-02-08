import { IsString, IsDateString } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  name: string;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;
} 