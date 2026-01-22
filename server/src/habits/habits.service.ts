import { Injectable, NotFoundException } from '@nestjs/common';
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
        habitLogs: true //
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

    return this.prisma.$transaction(async (tx) => {
      await tx.habitStep.update({
        where: { id: stepId },
        data: { isCompleted: newStatus },
      });

      const habit = step.habit;
      
      if (allStepsCompleted && !habit.isCompletedToday) {
        await tx.habit.update({
          where: { id: habit.id },
          data: {
            isCompletedToday: true,
            currentStreak: { increment: 1 },
            lastCompletedAt: new Date(),
          },
        });
        
        await tx.user.update({
            where: { id: userId },
            data: { xp: { increment: habit.xpReward } }
        });
      }
      
      else if (!allStepsCompleted && habit.isCompletedToday) {
        await tx.habit.update({
          where: { id: habit.id },
          data: {
            isCompletedToday: false,
            currentStreak: { decrement: 1 },

          },
        });

        await tx.user.update({
            where: { id: userId },
            data: { xp: { decrement: habit.xpReward } }
        });
      }

      return { stepId, isCompleted: newStatus, parentCompleted: allStepsCompleted };
    });
  }

  async toggleHabit(habitId: string, userId: string) {
    const habit = await this.prisma.habit.findUnique({ where: { id: habitId } });
    if (!habit || habit.userId !== userId) throw new NotFoundException();

    const countSteps = await this.prisma.habitStep.count({ where: { habitId } });
    if (countSteps > 0) {
        throw new Error("Cannot toggle complex habit directly, use steps");
    }

    const newStatus = !habit.isCompletedToday;

    return this.prisma.$transaction(async (tx) => {
        if (newStatus) {
            await tx.habit.update({
                where: { id: habitId },
                data: { isCompletedToday: true, currentStreak: { increment: 1 }, lastCompletedAt: new Date() }
            });
            await tx.user.update({ where: { id: userId }, data: { xp: { increment: habit.xpReward } } });
        } else {
            await tx.habit.update({
                where: { id: habitId },
                data: { isCompletedToday: false, currentStreak: { decrement: 1 } }
            });
            await tx.user.update({ where: { id: userId }, data: { xp: { decrement: habit.xpReward } } });
        }
        return { id: habitId, isCompletedToday: newStatus };
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
      }
    });
  }
}