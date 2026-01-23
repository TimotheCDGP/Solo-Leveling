import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { subDays, startOfDay, endOfDay, format, isToday, isYesterday } from 'date-fns';
import { GoalStatus } from 'generated/prisma/enums';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const dataToUpdate: any = { ...dto };

    if (dto.password) {
      const salt = await bcrypt.genSalt();
      dataToUpdate.password = await bcrypt.hash(dto.password, salt);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    const { password, ...result } = user;
    return result;
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        xp: true,
        streak: true,
        bestStreak: true,
      },
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async getProfileStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            goals: true,
          }
        },
        goals: {
          where: { status: GoalStatus.DONE }
        }
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const totalGoals = user._count.goals;
    const completedGoals = user.goals.length;

    const rankInfo = this.calculateRank(user.xp);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      totalGoals,
      completedGoals,
      totalXP: user.xp,
      rank: rankInfo.name,
      rankColor: rankInfo.color,
    };
  }

  async getDashboardStats(userId: string) {
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

  // Met à jour la série actuelle et le record personnel (bestStreak)

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
    if (xp < 500) return { name: 'E', color: '#94a3b8' };
    if (xp < 1500) return { name: 'D', color: '#22c55e' };
    if (xp < 3000) return { name: 'C', color: '#3b82f6' };
    if (xp < 5000) return { name: 'B', color: '#3b82f6' };
    if (xp < 7500) return { name: 'A', color: '#a855f7' };
    return { name: 'S', color: '#ef4444' };
  }

  async exportUserData(userId: string) {

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        goals: true,
        habits: {
          include: {
            steps: true,
            habitLogs: true,
          },
        },
        steps: true,
        userBadges: {
          include: { badge: true },
        },
      },
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable');

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        xp: user.xp,
        streak: user.streak,
        bestStreak: user.bestStreak,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      goals: user.goals,
      habits: user.habits,
      steps: user.steps,
      badges: user.userBadges.map(ub => ({
        id: ub.badge.id,
        name: ub.badge.name,
        description: ub.badge.description,
        unlockedAt: ub.unlockedAt,
      })),
    };
  }
}