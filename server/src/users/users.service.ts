import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, startOfDay, endOfDay, format, isToday, isYesterday } from 'date-fns';
import { GoalStatus } from 'generated/prisma/enums';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId: string) {
    // 1. Récupération des compteurs globaux et des infos utilisateur
    const [activeGoals, completedGoals, totalHabits, user, categories, priorities] = await Promise.all([
      this.prisma.goal.count({ where: { userId, NOT: { status: GoalStatus.DONE } } }),
      this.prisma.goal.count({ where: { userId, status: GoalStatus.DONE } }),
      this.prisma.habit.count({ where: { userId } }),
      this.prisma.user.findUnique({ 
        where: { id: userId }, 
        select: { xp: true, streak: true, bestStreak: true, updatedAt: true } 
      }),
      this.prisma.goal.groupBy({ by: ['category'], where: { userId }, _count: true }),
      this.prisma.goal.groupBy({ by: ['priority'], where: { userId }, _count: true }),
    ]);

    // 2. Génération de l'activité sur les 7 derniers jours
    const last7Days = Array.from({ length: 7 }, (_, i) => startOfDay(subDays(new Date(), i))).reverse();

    const weeklyActivity = await Promise.all(
      last7Days.map(async (day) => {
        const nextDay = endOfDay(day);

        const goalsActivity = await this.prisma.goal.count({
          where: {
            userId,
            updatedAt: { gte: day, lte: nextDay },
          },
        });

        const habitsActivity = await this.prisma.habit.count({
          where: {
            userId,
            updatedAt: { gte: day, lte: nextDay },
          },
        });

        return {
          date: format(day, 'yyyy-MM-dd'),
          desktop: goalsActivity, // Libellé "Objectifs" dans le chart
          mobile: habitsActivity,  // Libellé "Habitudes" dans le chart
        };
      })
    );

    const xp = user?.xp ?? 0;
    const rankInfo = this.calculateRank(xp);

    return {
      activeGoals,
      completedGoals,
      totalHabits,
      xp,
      bestStreak: user?.bestStreak ?? 0, // Utilisation du record personnel (Meilleure série)
      rank: rankInfo.name,
      rankColor: rankInfo.color,
      categoryData: categories.map(c => ({ name: c.category || "Autre", value: c._count })),
      priorityData: priorities.map(p => ({ name: p.priority, value: p._count })),
      weeklyActivity,
    };
  }

  /**
   * Met à jour la série actuelle et le record personnel (bestStreak)
   */
  async updateStreak(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true, bestStreak: true, updatedAt: true },
    });

    if (!user) return;

    // Si une action a déjà été faite aujourd'hui, on ne touche à rien
    if (isToday(user.updatedAt)) return;

    let newStreak = 1;
    if (isYesterday(user.updatedAt)) {
      // Si la dernière action date d'hier, on incrémente
      newStreak = user.streak + 1;
    }

    // Mise à jour du record personnel si la nouvelle série est supérieure
    const newBestStreak = Math.max(newStreak, user.bestStreak);

    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        streak: newStreak,
        bestStreak: newBestStreak,
      },
    });
  }

  private calculateRank(xp: number) {
    if (xp < 500) return { name: 'Rang E', color: '#94a3b8' };
    if (xp < 1500) return { name: 'Rang D', color: '#22c55e' };
    if (xp < 3000) return { name: 'Rang C', color: '#3b82f6' };
    return { name: 'Rang S', color: '#ef4444' };
  }
}