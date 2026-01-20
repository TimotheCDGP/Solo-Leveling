import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalStatus } from 'generated/prisma/enums';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  async createGoal(
    @Body() dto: CreateGoalDto,
    // Ici pour l'instant on simule l'userId pour tests
  ) {
    const userId = 'usertest1'; // <-- remplace par l'ID réel de l'utilisateur
    return this.goalsService.createGoal(dto, userId);
  }

  @Get()
  async getGoals(@Query('status') status?: GoalStatus) {
    const userId = 'usertest1'; // <-- remplace par l'ID réel de l'utilisateur
    return this.goalsService.findAll(userId, status);
  }
}