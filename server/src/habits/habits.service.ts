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
        name: dto.name,
        frequency: dto.frequency,
        category: dto.category,
        description: dto.description,
        userId,
        steps: {
          create: dto.steps?.map((s, i) => ({ title: s.title, order: i })) || [],
        },
      },
      include: {
        steps: true, // pour renvoyer les sous-étapes
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleHabitStep(stepId: string) {
    const step = await this.prisma.habitStep.findUnique({
      where: { id: stepId },
      include: {
        habit: {
          include: { steps: true },
        },
      },
    });

    if (!step) throw new NotFoundException('Step not found');

    const newStatus = !step.isCompleted;

    await this.prisma.habitStep.update({
      where: { id: stepId },
      data: { isCompleted: newStatus },
    });

    // Vérifie si toutes les étapes sont complètes pour mettre à jour la habit principale
    const steps = await this.prisma.habitStep.findMany({
      where: { habitId: step.habitId },
    });

    const allCompleted = steps.every(s => s.isCompleted);

    if (allCompleted) {
      await this.prisma.habit.update({
        where: { id: step.habitId },
        data: {
          isCompletedToday: true,
          currentStreak: { increment: 1 },
          lastCompletedAt: new Date(),
        },
      });
    }

    return { stepId, isCompleted: newStatus, allCompleted };
  }

}