import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('habits')
@UseGuards(JwtAuthGuard) // protège toutes les routes
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  async createHabit(
    @Body() dto: CreateHabitDto,
    @GetUser() user: { id: string },
  ) {
    return this.habitsService.createHabit(dto, user.id);
  }

  @Get()
  async getHabits(@GetUser() user: { id: string }) {
    return this.habitsService.findAll(user.id);
  }
}