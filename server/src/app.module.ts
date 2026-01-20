import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [PrismaModule, GoalsModule],
})
export class AppModule {}
