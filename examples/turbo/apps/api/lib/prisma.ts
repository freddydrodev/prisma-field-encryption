import { PrismaClient, Prisma } from '@repo/db'
import { fieldEncryptionExtension } from '@freddydrodev/prisma-field-encryption'

const globalForPrisma = globalThis as unknown as { PRISMA: PrismaClient }

export const PRISMA =
  globalForPrisma.PRISMA ||
  new PrismaClient().$extends(
    fieldEncryptionExtension({
      encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY,
      dmmf: Prisma.dmmf
    })
  )

if (process.env.NODE_ENV !== 'production') globalForPrisma.PRISMA = PRISMA
