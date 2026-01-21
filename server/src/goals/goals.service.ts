import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalStatus } from 'generated/prisma/enums';
import { UpdateGoalDto } from './dto/update-goal.dto';

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

                steps: steps && steps.length > 0 ? {
                    create: steps.map((step, index) => ({
                        title: step.title,
                        description: step.description,
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

    async update(user: any, id: string, dto: UpdateGoalDto) {
        const { steps, ...dataToUpdate } = dto;

        const goal = await this.prisma.goal.findUnique({ 
            where: { id },
            include: { steps: true }
        });

        if (!goal) throw new NotFoundException("Objectif introuvable");
        if (goal.userId !== user.id) throw new ForbiddenException("Accès refusé");

        if (dataToUpdate.status === 'DONE') {
            const uncompletedSteps = await this.prisma.step.count({
            where: {
                goalId: id,
                is_completed: false
            }
            });

            if (uncompletedSteps > 0) {
            throw new BadRequestException(
                `Impossible de valider l'objectif : il reste ${uncompletedSteps} étape(s) à terminer.`
            );
            }
        }

        return this.prisma.goal.update({
            where: { id },
            data: {
                ...dataToUpdate,
                startDate: dataToUpdate.startDate ? new Date(dataToUpdate.startDate) : undefined,
                deadline: dataToUpdate.deadline ? new Date(dataToUpdate.deadline) : undefined,
            },
            include: { steps: { orderBy: { order: 'asc' } } }
        });
    }
}