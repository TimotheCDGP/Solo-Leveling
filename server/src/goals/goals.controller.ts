import { Body, Controller, Get, Post, Query, ParseEnumPipe, UseGuards, Patch, Param } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalStatus } from 'generated/prisma/enums';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateGoalDto } from './dto/update-goal.dto';

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
    @Query('status') status?: string,
  ) {
    return this.goalsService.findAll(user.id, status as GoalStatus | undefined);
  }

  @Patch(':id')
  update(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto
  ) {
    return this.goalsService.update(user, id, updateGoalDto);
  }
}