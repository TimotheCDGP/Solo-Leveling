import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalStatus } from 'generated/prisma/enums';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { BadgesService } from '../badges/badges.service';

@Injectable()
export class GoalsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly badgesService: BadgesService,
    ) { }

    async createGoal(dto: CreateGoalDto, userId: string) {
        const { steps, ...rest } = dto;

        return this.prisma.$transaction(async (tx) => {
            const goal = await tx.goal.create({
                data: {
                    title: rest.title,
                    description: rest.description,
                    category: rest.category,
                    startDate: rest.startDate ? new Date(rest.startDate) : undefined,
                    deadline: rest.deadline ? new Date(rest.deadline) : undefined,
                    priority: rest.priority,
                    status: rest.status || GoalStatus.TODO,
                    userId: userId,
                    steps: steps && steps.length > 0 ? {
                        create: steps.map((step, index) => ({
                            title: step.title,
                            description: step.description,
                            order: index,
                            is_completed: rest.status === GoalStatus.DONE,
                            userId: userId 
                        }))
                    } : undefined,
                },
                include: { steps: { orderBy: { order: 'asc' } } }
            });

            if (goal.status === GoalStatus.DONE) {
                await tx.user.update({
                    where: { id: userId },
                    data: { xp: { increment: goal.xpReward } }
                });
                await this.badgesService.checkGoalsBadges(userId);
            }

            return goal;
        });
    }

    async findAll(userId: string, status?: GoalStatus) {
        return this.prisma.goal.findMany({
            where: {
                userId,
                ...(status ? { status } : {}),
            },
            include: {
                steps: { orderBy: { order: 'asc' } }
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

        if (dataToUpdate.status === GoalStatus.DONE && goal.status !== GoalStatus.DONE) {
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

            return this.prisma.$transaction(async (tx) => {
                const updatedGoal = await tx.goal.update({
                    where: { id },
                    data: {
                        ...dataToUpdate,
                        startDate: dataToUpdate.startDate ? new Date(dataToUpdate.startDate) : undefined,
                        deadline: dataToUpdate.deadline ? new Date(dataToUpdate.deadline) : undefined,
                    },
                    include: { steps: { orderBy: { order: 'asc' } } }
                });

                await tx.user.update({
                    where: { id: user.id },
                    data: { xp: { increment: goal.xpReward } }
                });

                await this.badgesService.checkGoalsBadges(user.id);

                return updatedGoal;
            });
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