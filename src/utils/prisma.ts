// import { PrismaClient } from '@prisma/client';

import { PrismaClient } from '../generated/prisma/client';

// The client now automatically reads the configuration from prisma.config.ts
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // accelerateUrl is required by the generated Prisma client types. Read from env or default to empty string.
    accelerateUrl: process.env.PRISMA_ACCELERATE_URL || '',
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
