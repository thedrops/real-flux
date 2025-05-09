// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // opcional: log de queries no console
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
