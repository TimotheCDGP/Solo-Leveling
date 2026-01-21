import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HabitsCron {
  constructor(private prisma: PrismaService) {}

  @Cron('0 0 * * *') // minuit tous les jours
  async resetHabits() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await this.prisma.habit.updateMany({
      where: { lastCompletedAt: { lt: yesterday } },
      data: { currentStreak: 0 },
    });

    await this.prisma.habit.updateMany({
      data: { isCompletedToday: false },
    });
  }
}