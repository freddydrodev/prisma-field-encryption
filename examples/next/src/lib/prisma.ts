import { PrismaClient, Prisma } from '@/generated/prisma'
import { fieldEncryptionExtension } from '@freddydrodev/prisma-field-encryption'

const globalForPrisma = globalThis as unknown as { PRISMA: PrismaClient }

export const PRISMA =
  globalForPrisma.PRISMA ||
  new PrismaClient().$extends(
    fieldEncryptionExtension({
      encryptionKey: process.env.CLOAK_MASTER_KEY,
      dmmf: Prisma.dmmf
    })
  )

if (process.env.NODE_ENV !== 'production') globalForPrisma.PRISMA = PRISMA
