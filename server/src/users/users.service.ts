import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GoalStatus } from 'generated/prisma/enums';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
    });
    const { password, ...result } = user;
    return result;
  }

  async getProfileStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        goals: true,
        habits: true,
        steps: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const totalGoals = user.goals.length;
    const completedGoals = user.goals.filter(g => g.status === GoalStatus.DONE).length;

    // Calcul de l'XP totale : 10 XP par objectif complété + 1 XP par habit complété
    const totalXP = completedGoals * 10 + user.habits.filter(h => h.isCompletedToday).length;

    // Calcul du Rang : E → S
    let rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' = 'E';
    if (totalXP >= 100) rank = 'S';
    else if (totalXP >= 75) rank = 'A';
    else if (totalXP >= 50) rank = 'B';
    else if (totalXP >= 30) rank = 'C';
    else if (totalXP >= 15) rank = 'D';

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      totalGoals,
      completedGoals,
      totalXP,
      rank,
    };
  }
}