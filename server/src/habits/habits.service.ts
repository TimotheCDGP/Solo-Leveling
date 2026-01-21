import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';

@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService) {}

  async createHabit(dto: CreateHabitDto, userId: string) {
    return this.prisma.habit.create({
      data: {
        title: dto.title,
        name: dto.name,
        frequency: dto.frequency,
        category: dto.category,
        description: dto.description,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}