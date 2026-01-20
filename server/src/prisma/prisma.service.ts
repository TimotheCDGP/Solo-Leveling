import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Crée l’adapter avec la chaîne de connexion
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });

    // Passe l’adapter au constructeur de PrismaClient
    super({ adapter });

    // Optionnel : logger pour debug
    // super({ adapter, log: ['query', 'error', 'warn'] });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}