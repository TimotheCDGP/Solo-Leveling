import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StepsService } from './steps.service';
import { CreateStepDto } from './dto/create-step.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('steps')
@UseGuards(JwtAuthGuard)
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post()
  async createStep(
    @Body() dto: CreateStepDto,
    @GetUser() user: { id: string },
  ) {
    return this.stepsService.createStep(dto, user.id);
  }

  @Get()
  async getSteps(@GetUser() user: { id: string }) {
    return this.stepsService.findAll(user.id);
  }
}