import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';

@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService) { }

  async createHabit(dto: CreateHabitDto, userId: string) {
    return this.prisma.habit.create({
      data: {
        title: dto.title,
        frequency: dto.frequency,
        category: dto.category,
        description: dto.description,
        userId,
        steps: {
          create: dto.steps?.map((s, i) => ({ title: s.title, order: i })) || [],
        },
      },
      include: { steps: true },
    });
  }

  async findAll(userId: string) {
    return this.prisma.habit.findMany({
      where: { userId },
      include: { 
        steps: { orderBy: { order: 'asc' } },
        habitLogs: true 
      }, 
      orderBy: { createdAt: 'desc' },
    });
  }

  async addStep(habitId: string, title: string, userId: string) {
    const habit = await this.prisma.habit.findUnique({ where: { id: habitId } });
    if (!habit || habit.userId !== userId) throw new NotFoundException();

    const lastStep = await this.prisma.habitStep.findFirst({
        where: { habitId },
        orderBy: { order: 'desc' }
    });
    const newOrder = lastStep ? lastStep.order + 1 : 0;

    return this.prisma.habitStep.create({
        data: {
            title,
            habitId,
            order: newOrder
        }
    });
  }

  async removeStep(stepId: string, userId: string) {
      return this.prisma.habitStep.delete({ where: { id: stepId } });
  }

  async updateStep(stepId: string, title: string, userId: string) {
    const step = await this.prisma.habitStep.findUnique({
      where: { id: stepId },
      include: { habit: true },
    });

    if (!step || step.habit.userId !== userId) {
      throw new NotFoundException("Étape introuvable ou accès non autorisé");
    }

    return this.prisma.habitStep.update({
      where: { id: stepId },
      data: { title },
    });
  }

  /**
   * Toggle une étape spécifique
   * Mis à jour pour renvoyer l'Habit COMPLET
   */
  async toggleHabitStep(stepId: string, userId: string) {
    const step = await this.prisma.habitStep.findUnique({
      where: { id: stepId },
      include: { habit: { include: { steps: true } } },
    });

    if (!step) throw new NotFoundException('Step not found');
    if (step.habit.userId !== userId) throw new NotFoundException('Access denied');

    const newStatus = !step.isCompleted;
    const otherSteps = step.habit.steps.filter(s => s.id !== stepId);
    const allStepsCompleted = otherSteps.every(s => s.isCompleted) && newStatus === true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.$transaction(async (tx) => {
      // 1. Update de l'étape
      await tx.habitStep.update({
        where: { id: stepId },
        data: { isCompleted: newStatus },
      });

      const habit = step.habit;
      
      // 2. Si TOUTES les étapes sont finies : On valide l'Habit et on crée un LOG
      if (allStepsCompleted && !habit.isCompletedToday) {
        await tx.habit.update({
          where: { id: habit.id },
          data: {
            isCompletedToday: true,
            currentStreak: { increment: 1 },
            lastCompletedAt: new Date(),
            habitLogs: { create: { date: new Date() } }
          },
        });
        
        await tx.user.update({
            where: { id: userId },
            data: { xp: { increment: habit.xpReward } }
        });
      }
      // 3. Si on décoche une étape alors que l'Habit était fini : On dévalide et supprime le LOG
      else if (!allStepsCompleted && habit.isCompletedToday) {
        await tx.habit.update({
          where: { id: habit.id },
          data: {
            isCompletedToday: false,
            currentStreak: { decrement: 1 },
          },
        });

        await tx.habitLog.deleteMany({
          where: { habitId: habit.id, date: { gte: today } }
        });

        await tx.user.update({
            where: { id: userId },
            data: { xp: { decrement: habit.xpReward } }
        });
      }

      // RETOUR : On renvoie l'habit complet pour le Frontend
      return tx.habit.findUnique({
        where: { id: habit.id },
        include: { steps: { orderBy: { order: 'asc' } }, habitLogs: true }
      });
    });
  }

  /**
   * Toggle l'habitude globale
   */
  async toggleHabit(habitId: string, userId: string) {
    const habit = await this.prisma.habit.findUnique({ 
      where: { id: habitId },
      include: { steps: true, habitLogs: true }
    });

    if (!habit || habit.userId !== userId) throw new NotFoundException();

    if (habit.steps.length > 0) {
      const allStepsCompleted = habit.steps.every(s => s.isCompleted);
      if (!habit.isCompletedToday && !allStepsCompleted) {
        throw new BadRequestException("Toutes les étapes doivent être validées avant de terminer la mission.");
      }
    }

    const newStatus = !habit.isCompletedToday;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.$transaction(async (tx) => {
      if (newStatus) {
        await tx.habit.update({
          where: { id: habitId },
          data: { 
            isCompletedToday: true, 
            currentStreak: { increment: 1 }, 
            lastCompletedAt: new Date(),
            habitLogs: { create: { date: new Date() } }
          }
        });
        await tx.user.update({ where: { id: userId }, data: { xp: { increment: habit.xpReward } } });
      } else {
        await tx.habit.update({
          where: { id: habitId },
          data: { isCompletedToday: false, currentStreak: { decrement: 1 } }
        });
        await tx.habitLog.deleteMany({
          where: { habitId, date: { gte: today } }
        });
        await tx.user.update({ where: { id: userId }, data: { xp: { decrement: habit.xpReward } } });
      }

      return tx.habit.findUnique({
        where: { id: habitId },
        include: { steps: { orderBy: { order: 'asc' } }, habitLogs: true }
      });
    });
  }

  async remove(id: string, userId: string) {
    const habit = await this.prisma.habit.findUnique({ where: { id } });
    if (!habit || habit.userId !== userId) throw new NotFoundException();
    return this.prisma.habit.delete({ where: { id } });
  }

  async update(id: string, data: any, userId: string) {
    const habit = await this.prisma.habit.findUnique({ where: { id } });
    if (!habit || habit.userId !== userId) throw new NotFoundException();

    return this.prisma.habit.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
      },
      include: { steps: true, habitLogs: true }
    });
  }
}