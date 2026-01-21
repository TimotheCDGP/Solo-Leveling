import { Controller, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StepsService } from './steps.service';
import { CreateStepDto } from './dto/create-step.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';

@Controller('steps')
@UseGuards(JwtAuthGuard)
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post(':goalId')
  create(
    @GetUser() user: any,
    @Param('goalId') goalId: string,
    @Body() createStepDto: CreateStepDto,
  ) {
    return this.stepsService.create(user, goalId, createStepDto);
  }

  @Patch(':id/toggle')
  toggle(
    @GetUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.stepsService.toggle(userId, id);
  }

  @Delete(':id')
  remove(
    @GetUser('id') userId: string,
    @Param('id') id: string
  ) {
    return this.stepsService.remove(userId, id);
  }
}