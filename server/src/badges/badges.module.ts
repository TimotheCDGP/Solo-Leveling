import { Module } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { BadgesController } from '../badges/badges.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [BadgesService, PrismaService],
  controllers: [BadgesController],
  exports: [BadgesService],
})
export class BadgesModule {}