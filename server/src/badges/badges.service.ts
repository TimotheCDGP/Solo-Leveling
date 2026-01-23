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

  /**
   * Vérifie et débloque les badges liés au Streak
   */
  async checkStreakBadges(userId: string, currentStreak: number) {
  const conditions: string[] = [];
    if (currentStreak >= 2) conditions.push('2_days_streak'); // Test rapide
    if (currentStreak >= 7) conditions.push('7_days_streak');
    if (currentStreak >= 30) conditions.push('30_days_streak');

    return this.handleBadgeUnlocking(userId, conditions);
  }


  async checkHabitCompletionBadges(userId: string) {
    // Compte total de logs complétés pour cet utilisateur
    const completedHabitsCount = await this.prisma.habitLog.count({
      where: { habit: { userId }, isCompleted: true },
    });

    const conditions: string[] = [];
    if (completedHabitsCount >= 1) conditions.push('first_habit_completed');
    
    return this.handleBadgeUnlocking(userId, conditions);
  }
  /**
   * Vérifie et débloque les badges liés aux objectifs
   */
  async checkGoalsBadges(userId: string) {
    const completedGoalsCount = await this.prisma.goal.count({
      where: { userId, status: 'DONE' },
    });

    const conditions: string[] = [];
    if (completedGoalsCount >= 1) conditions.push('first_goal_completed');
    if (completedGoalsCount >= 10) conditions.push('10_goals_completed');

    return this.handleBadgeUnlocking(userId, conditions);
  }

  /**
   * Logique générique pour débloquer des badges
   */
  private async handleBadgeUnlocking(userId: string, conditions: string[]) {
    if (conditions.length === 0) return null;

    // 1. Trouver les badges correspondant aux conditions remplies
    const eligibleBadges = await this.prisma.badge.findMany({
      where: { condition: { in: conditions } },
    });

    const unlockedBadges: any[] = [];

    for (const badge of eligibleBadges) {
      // 2. Vérifier si l'utilisateur a déjà ce badge
      const alreadyHasBadge = await this.prisma.userBadge.findUnique({
        where: {
          userId_badgeId: { userId, badgeId: badge.id },
        },
      });

      // 3. Si non, on le crée (Déblocage !)
      if (!alreadyHasBadge) {
        const newUserBadge = await this.prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
            unlockedAt: new Date(),
          },
          include: { badge: true },
        });
        unlockedBadges.push(newUserBadge.badge);
      }
    }

    return unlockedBadges.length > 0 ? unlockedBadges : null;
  }

  async seedBadges() {
    const badges = [
      { 
        name: "Éveil du Hunter", 
        description: "Valider votre toute première habitude", 
        icon: "Sparkles", 
        condition: "first_habit_completed" 
      },
      { 
        name: "Premier Sang", 
        description: "Terminer votre premier objectif (Goal)", 
        icon: "Sword", 
        condition: "first_goal_completed" 
      },
      { 
        name: "Discipline de Fer", 
        description: "Atteindre un streak de 2 jours", 
        icon: "Footprints", 
        condition: "2_days_streak" 
      },

      { 
        name: "Ténacité de Sung", 
        description: "Atteindre un streak de 7 jours", 
        icon: "Flame", 
        condition: "7_days_streak" 
      },
      { 
        name: "Volonté Inébranlable", 
        description: "Atteindre un streak de 30 jours", 
        icon: "Crown", 
        condition: "30_days_streak" 
      },

      { 
        name: "Explorateur de Donjons", 
        description: "Terminer 5 objectifs", 
        icon: "Map", 
        condition: "5_goals_completed" 
      },
      { 
        name: "Maître de la Guilde", 
        description: "Terminer 10 objectifs", 
        icon: "Shield", 
        condition: "10_goals_completed" 
      },

      { 
        name: "Architecte du Destin", 
        description: "Créer 5 habitudes différentes", 
        icon: "Layout", 
        condition: "5_habits_created" 
      }
    ];

    for (const badge of badges) {
      await this.prisma.badge.upsert({
        where: { name: badge.name },
        update: {},
        create: badge,
      });
    }
  }
}