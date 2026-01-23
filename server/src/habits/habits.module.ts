import { Module } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { HabitsCronService } from './habits.cron';
import { PrismaModule } from '../prisma/prisma.module';
import { BadgesModule } from 'src/badges/badges.module';

@Module({
  imports: [PrismaModule, BadgesModule],
  controllers: [HabitsController],
  providers: [
    HabitsService, 
    HabitsCronService
  ],
  exports: [HabitsService]
})
export class HabitsModule {}