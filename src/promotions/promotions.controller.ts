import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    return this.promotionsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    // TODO: Ajouter la vérification du rôle admin
    return this.promotionsService.create(createPromotionDto);
  }
} 