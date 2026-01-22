import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GoalsModule } from './goals/goals.module';
import { HabitsModule } from './habits/habits.module';
import { StepsModule } from './steps/steps.module';
import { PrismaModule } from './prisma/prisma.module';
import { BadgesModule } from './badges/badges.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    GoalsModule,
    HabitsModule,
    StepsModule,
    PrismaModule,
    BadgesModule,
  ],
})
export class AppModule {}