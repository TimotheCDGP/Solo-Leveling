import { Controller, Get, UseGuards } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('badges')
@UseGuards(JwtAuthGuard)
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get('me')
  getMyBadges(@GetUser() user: { id: string }) {
    return this.badgesService.getUserBadges(user.id);
  }
}