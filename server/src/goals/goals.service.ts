import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalStatus } from 'generated/prisma/enums';

@Injectable()
export class GoalsService {
    constructor(private readonly prisma: PrismaService) { }

    async createGoal(dto: CreateGoalDto, userId: string, status?: GoalStatus) {
        return this.prisma.goal.create({
            data: {
                title: dto.title,
                description: dto.description,
                category: dto.category,
                deadline: new Date(dto.deadline),
                priority: dto.priority,
                status: status ?? undefined,
                userId: userId,
            },
        });
    }

    async findAll(userId: string, status?: GoalStatus) {
        return this.prisma.goal.findMany({
            where: {
                userId,
                ...(status ? { status } : {}),
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}