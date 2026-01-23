import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BadgesModule } from 'src/badges/badges.module';

@Module({
  imports: [PrismaModule, BadgesModule],
  providers: [GoalsService],
  controllers: [GoalsController],
})
export class GoalsModule {}