import { Body, Controller, Get, Post, Query, DefaultValuePipe, ParseEnumPipe, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalStatus } from 'generated/prisma/enums';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  async createGoal(
    @Body() dto: CreateGoalDto,
    @GetUser() user: { id: string },
  ) {
    return this.goalsService.createGoal(dto, user.id);
  }

  @Get()
  async getGoals(
    @GetUser() user: { id: string },
    @Query(
      'status',
      new DefaultValuePipe(GoalStatus.TODO),
      new ParseEnumPipe(GoalStatus),
    )
    status: GoalStatus,
  ) {
    return this.goalsService.findAll(user.id, status);
  }
}