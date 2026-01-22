import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HabitsCronService {
  private readonly logger = new Logger(HabitsCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Se lance tous les jours à minuit
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyReset() {
    this.logger.debug('Running daily habit reset...');

    // 1. Gérer les Streaks brisés
    // Si une habitude n'a pas été complétée hier (lastCompletedAt < hier minuit), streak = 0
    // Note : C'est une logique simplifiée. Pour être précis, il faut comparer les dates.
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // On remet à 0 le streak de ceux qui n'ont PAS validé hier
    // (Attention : cette logique reset tout le monde si le serveur plante un jour. 
    // Pour un MVP c'est ok, pour la prod il faut être plus fin).
    await this.prisma.habit.updateMany({
      where: {
        isCompletedToday: false, // Ne l'a pas fait aujourd'hui (hier avant le reset)
        lastCompletedAt: {
           lt: yesterday // Et la dernière fois c'était avant hier
        }
      },
      data: {
        currentStreak: 0
      }
    });

    // 2. Reset global du status journalier pour tout le monde
    await this.prisma.habit.updateMany({
      data: {
        isCompletedToday: false,
      },
    });
    
    // 3. Reset des sous-étapes
    await this.prisma.habitStep.updateMany({
        data: {
            isCompleted: false
        }
    });

    this.logger.debug('Daily habit reset complete.');
  }
}