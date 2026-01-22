import { Body, Controller, Get, Post, Patch, Param, UseGuards, Delete } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('habits')
@UseGuards(JwtAuthGuard) // protège toutes les routes
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) { }

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

  // Route : PATCH /habits/step/:id
  @Patch('step/:id')
  toggleStep(@Param('id') id: string, @GetUser() user: { id: string }) {
    return this.habitsService.toggleHabitStep(id, user.id);
  }

  // Cocher/Décocher une HABITUDE SIMPLE (Sans étapes)
  // Route : PATCH /habits/:id
  @Patch(':id')
  toggleHabit(@Param('id') id: string, @GetUser() user: { id: string }) {
    return this.habitsService.toggleHabit(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: { id: string }) {
    return this.habitsService.remove(id, user.id);
  }

  @Patch(':id/update')
  update(@Param('id') id: string, @Body() updateDto: any, @GetUser() user: { id: string }) {
    return this.habitsService.update(id, updateDto, user.id);
  }

  @Patch('steps/:stepId')
  updateStep(
    @Param('stepId') stepId: string,
    @Body('title') title: string,
    @GetUser() user: { id: string },
  ) {
    return this.habitsService.updateStep(stepId, title, user.id);
  }

  @Post(':id/steps')
  addStep(@Param('id') id: string, @Body('title') title: string, @GetUser() user: { id: string }) {
    return this.habitsService.addStep(id, title, user.id);
  }

  @Delete('steps/:stepId')
  removeStep(@Param('stepId') stepId: string, @GetUser() user: { id: string }) {
    return this.habitsService.removeStep(stepId, user.id);
  }

}