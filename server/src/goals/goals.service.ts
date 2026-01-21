import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalStatus } from 'generated/prisma/enums';

@Injectable()
export class GoalsService {
    constructor(private readonly prisma: PrismaService) { }

    async createGoal(dto: CreateGoalDto, userId: string, status?: GoalStatus) {
        const { steps, ...rest } = dto;

        return this.prisma.goal.create({
            data: {
                title: rest.title,
                description: rest.description,
                category: rest.category,
                startDate: rest.startDate ? new Date(rest.startDate) : undefined,
                deadline: rest.deadline ? new Date(rest.deadline) : undefined,
                priority: rest.priority,
                status: status ?? rest.status ?? undefined,
                userId: userId,

                // 👇 MISE À JOUR ICI
                steps: steps && steps.length > 0 ? {
                    create: steps.map((step, index) => ({
                        title: step.title,             // On accède à la propriété .title
                        description: step.description, // On accède à la propriété .description
                        order: index,
                        is_completed: false,
                        userId: userId 
                    }))
                } : undefined,
            },
            include: {
                steps: { orderBy: { order: 'asc' } }
            }
        });
    }

    async findAll(userId: string, status?: GoalStatus) {
        return this.prisma.goal.findMany({
            where: {
                userId,
                ...(status ? { status } : {}),
            },
            include: {
                steps: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}