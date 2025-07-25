import { PrismaClient } from '../generated/prisma'
import { fieldEncryptionExtension } from 'prisma-field-encryption'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Extend the Prisma client with field encryption
export const db = prisma.$extends(
  fieldEncryptionExtension({
    // You can also pass the encryption key directly here
    // encryptionKey: process.env.PRISMA_FIELD_ENCRYPTION_KEY
  })
)
