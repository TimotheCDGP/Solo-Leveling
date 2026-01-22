import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BadgesService {
  constructor(private prisma: PrismaService) {}

  async getUserBadges(userId: string) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { unlockedAt: 'desc' },
    });
  }

  async checkStreakBadge(userId: string, streak: number) {
    const streakBadge = await this.prisma.userBadge.findFirst({
      where: { userId, badge: { condition: '7_days_streak' } },
      include: { badge: true },
      orderBy: { unlockedAt: 'desc' },
    });

    if (streak >= 7 && streakBadge && !streakBadge.unlockedAt) {
      await this.prisma.userBadge.update({
        where: { id: streakBadge.id },
        data: { unlockedAt: new Date() },
      });
    }
  }

  async checkGoalsBadge(userId: string, completedGoals: number) {
    const goalsBadge = await this.prisma.userBadge.findFirst({
      where: { userId, badge: { condition: '10_goals_completed' } },
      include: { badge: true },
      orderBy: { unlockedAt: 'desc' },
    });

    if (completedGoals >= 10 && goalsBadge && !goalsBadge.unlockedAt) {
      await this.prisma.userBadge.update({
        where: { id: goalsBadge.id },
        data: { unlockedAt: new Date() },
      });
    }
  }

  async createUserBadge(userId: string, badgeId: string) {

    return this.prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId } },
      update: {},
      create: { userId, badgeId },
    });
  }

  async createBadges(badges: { name: string; description: string; icon: string; condition: string }[]) {
    for (const badge of badges) {
      await this.prisma.badge.upsert({
        where: { name: badge.name },
        update: {},
        create: badge,
      });
    }
  }
}