import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GoalsModule } from './goals/goals.module';
import { AuthModule } from './auth/auth.module';
import { HabitsModule } from './habits/habits.module';
import { StepsModule } from './steps/steps.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    GoalsModule,
    HabitsModule,
    StepsModule,
    UsersModule,
  ],
})
export class AppModule { }