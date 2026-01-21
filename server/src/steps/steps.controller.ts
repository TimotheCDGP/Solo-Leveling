import { Controller, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StepsService } from './steps.service';
import { CreateStepDto } from './dto/create-step.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { UpdateStepDto } from './dto/update-step.dto';

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
    @GetUser() user: any,
    @Param('id') id: string
  ) {
    return this.stepsService.toggle(user, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateStepDto: UpdateStepDto
  ) {
    return this.stepsService.update(id, updateStepDto);
  }

  @Delete(':id')
  remove(
    @GetUser() user: any,
    @Param('id') id: string
  ) {
    return this.stepsService.remove(user, id);
  }
}