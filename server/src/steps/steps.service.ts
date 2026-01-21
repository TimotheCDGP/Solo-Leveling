import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStepDto } from './dto/create-step.dto';

@Injectable()
export class StepsService {
  constructor(private readonly prisma: PrismaService) {}

  async createStep(dto: CreateStepDto, userId: string) {
    return this.prisma.step.create({
      data: {
        title: dto.title,
        description: dto.description,
        userId,
        is_completed: dto.is_completed ?? false,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.step.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}