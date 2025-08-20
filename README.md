# Next.js + Prisma Field Encryption Example

This example demonstrates how to use the Prisma Field Encryption library with Next.js 15 and Prisma 6.14.0.

## Features

- ✅ Next.js 15 with App Router
- ✅ Prisma 6.14.0 with field encryption
- ✅ TypeScript support
- ✅ Tailwind CSS for styling
- ✅ SQLite database for simplicity
- ✅ API routes demonstrating encryption/decryption
- ✅ Interactive frontend to test functionality

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   # .env
   DATABASE_URL="file:./dev.db"
   PRISMA_FIELD_ENCRYPTION_KEY="k1.aesgcm256.DbQoar8ZLuUsOHZNyrnjlskInHDYlzF3q6y1KGM7DUM="
   ```

3. **Generate Prisma client:**

   ```bash
   npx prisma generate
   ```

4. **Create and migrate database:**

   ```bash
   npx prisma db push
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How it Works

### Database Schema

The example includes two models with encrypted fields:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?  /// @encrypted
  nameHash  String?  /// @encryption:hash(name)?normalize=lowercase&normalize=trim
  ssn       String?  /// @encrypted?mode=strict
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?  /// @encrypted
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Field Encryption Setup

The Prisma client is extended with field encryption in `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '../generated/prisma'
import { fieldEncryptionExtension } from 'prisma-field-encryption'

export const prisma = new PrismaClient()

export const db = prisma.$extends(
  fieldEncryptionExtension({
    // Encryption key is loaded from environment variable
  })
)
```

### API Routes

The example includes API routes that demonstrate:

- Creating users with encrypted names and SSNs
- Creating posts with encrypted content
- Retrieving data with automatic decryption
- Relationships between encrypted fields

### Frontend

The frontend allows you to:

- Create users with names and SSNs (automatically encrypted)
- Create posts with content (automatically encrypted)
- View all data with automatic decryption
- See how the encryption is transparent to the application

## Testing the Encryption

1. **Create a user** with a name and SSN
2. **Create a post** with content
3. **Check the database directly** to see encrypted values:
   ```bash
   npx prisma studio
   ```
4. **Notice** that the data appears encrypted in the database but decrypted in the application

## Key Features Demonstrated

- **Transparent Encryption**: Data is automatically encrypted/decrypted
- **Hash Fields**: Name hash allows searching by name
- **Strict Mode**: SSN field uses strict mode for additional security
- **Relationships**: Encrypted fields work seamlessly with Prisma relations
- **API Integration**: Works perfectly with Next.js API routes

## Environment Variables

- `DATABASE_URL`: SQLite database file location
- `PRISMA_FIELD_ENCRYPTION_KEY`: Encryption key for field encryption

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Learn More

- [Prisma Field Encryption Documentation](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
