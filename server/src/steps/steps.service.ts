import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';

@Injectable()
export class StepsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: any, goalId: string, createStepDto: CreateStepDto) {
    const goal = await this.prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) throw new NotFoundException('Objectif introuvable');
    console.log(user.id, goal.userId);
    if (goal.userId !== user.id) throw new ForbiddenException('Vous ne pouvez pas ajouter d\'étape à cet objectif');

    const lastStep = await this.prisma.step.findFirst({
      where: { goalId },
      orderBy: { order: 'desc' },
    });
    
    const newOrder = lastStep ? lastStep.order + 1 : 0;

    return this.prisma.step.create({
      data: {
        title: createStepDto.title,
        description: createStepDto.description,
        order: newOrder,
        is_completed: false,
        goal: {
            connect: { id: goalId }
        },
        user: {
            connect: { id: user.id }
        }
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.step.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggle(user: any, stepId: string) {
    const step = await this.prisma.step.findUnique({
      where: { id: stepId },
    });

    if (!step) throw new NotFoundException('Étape introuvable');
    console.log(user.id, step.userId);
    if (step.userId !== user.id) throw new ForbiddenException('Accès refusé');

    return this.prisma.step.update({
      where: { id: stepId },
      data: { 
        is_completed: !step.is_completed 
      },
    });
  }

  async update(id: string, updateStepDto: UpdateStepDto) {
    const step = await this.prisma.step.findUnique({ where: { id } });
    if (!step) throw new NotFoundException('Étape introuvable');

    return this.prisma.step.update({
      where: { id },
      data: {
        title: updateStepDto.title,
        description: updateStepDto.description,
      },
    });
  }

  async remove(user: any, stepId: string) {
    console.log("Trying to delete step:", stepId);
    try {
        const deletedStep = await this.prisma.step.delete({
            where: { 
                id: stepId,
            }
        });

        
        if (deletedStep.userId !== user.id) {
             throw new ForbiddenException();
        }
        return deletedStep;

    } catch (error) {
        const step = await this.prisma.step.findUnique({ where: { id: stepId }});
        if (!step) throw new NotFoundException("Étape introuvable");
        if (step.userId !== user.id) throw new ForbiddenException("Accès refusé");
        
        return this.prisma.step.delete({ where: { id: stepId }});
    }
  }
}