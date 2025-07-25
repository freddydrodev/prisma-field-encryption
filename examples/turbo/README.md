# Turbo Todo App with Prisma Field Encryption

This is a monorepo implementation of the Todo App using Turborepo, featuring:

- **API App** (`apps/api`): Next.js API routes for todo CRUD operations
- **Web App** (`apps/web`): Next.js frontend with Tailwind CSS
- **Database Package** (`packages/database`): Shared Prisma configuration and client
- **UI Package** (`packages/ui`): Shared UI components
- **TypeScript Config** (`packages/typescript-config`): Shared TypeScript configuration
- **ESLint Config** (`packages/eslint-config`): Shared ESLint configuration

## Architecture

```
turbo/
├── apps/
│   ├── api/          # Next.js API server (port 3001)
│   └── web/          # Next.js web app (port 3000)
├── packages/
│   ├── database/     # Shared Prisma client and schema
│   ├── ui/           # Shared UI components
│   ├── typescript-config/
│   └── eslint-config/
└── package.json
```

## Features

- ✅ **Monorepo Structure**: Separated API and web applications
- ✅ **Shared Database**: Prisma client shared across packages
- ✅ **Field Encryption**: Prisma field encryption support (ready for implementation)
- ✅ **TypeScript**: Full TypeScript support
- ✅ **Tailwind CSS**: Modern styling with Tailwind CSS v4
- ✅ **CRUD Operations**: Full Create, Read, Update, Delete for todos
- ✅ **Real-time Updates**: Immediate UI updates after API calls

## Prerequisites

- Node.js 18+
- pnpm 9.0.0+

## Setup

1. **Install dependencies and setup database:**

   ```bash
   ./setup.sh
   ```

2. **Start development servers:**

   ```bash
   pnpm dev
   ```

3. **Access the applications:**
   - Web App: http://localhost:3000
   - API: http://localhost:3001

## Testing

Run the automated test script to verify all functionality:

```bash
./test.sh
```

This will:

- Start both development servers
- Test all API endpoints (GET, POST, PUT, DELETE)
- Verify web app accessibility
- Display test results

## API Endpoints

### Todos

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

### Request/Response Format

**Create Todo:**

```json
POST /api/todos
{
  "title": "Task title",
  "description": "Optional description"
}
```

**Update Todo:**

```json
PUT /api/todos/[id]
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

## Database Schema

```prisma
model Todo {
  id          String   @id @default(cuid())
  title       String   @unique /// @encrypted
  titleHash   String?  @unique /// @encryption:hash(title)
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Field Encryption

The app is prepared for field encryption with the `@freddydrodev/prisma-field-encryption` package. To enable encryption:

1. Uncomment the encryption key in `packages/database/.env`:

   ```
   CLOAK_MASTER_KEY="your-32-character-encryption-key"
   ```

2. Update `packages/database/src/index.ts` to include the encryption extension:

   ```typescript
   import { fieldEncryptionExtension } from '@freddydrodev/prisma-field-encryption'

   export const PRISMA = new PrismaClient().$extends(
     fieldEncryptionExtension({
       encryptionKey: process.env.CLOAK_MASTER_KEY,
       dmmf: Prisma.dmmf
     })
   )
   ```

## Development

### Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Run ESLint on all packages
- `pnpm check-types` - Run TypeScript type checking

### Database Commands

```bash
cd packages/database
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open Prisma Studio
pnpm db:push      # Push schema changes to database
```

## Comparison with Next.js Example

| Feature          | Next.js Example                  | Turbo Example                 |
| ---------------- | -------------------------------- | ----------------------------- |
| Architecture     | Monolithic (API + UI in one app) | Monorepo (separated API + UI) |
| Database         | Local Prisma setup               | Shared database package       |
| Styling          | Tailwind CSS v4                  | Tailwind CSS v4               |
| TypeScript       | ✅                               | ✅                            |
| Field Encryption | ✅                               | ✅ (ready)                    |
| Ports            | 3000 (combined)                  | 3000 (web) + 3001 (api)       |
| Scalability      | Single app                       | Modular packages              |

## Troubleshooting

### Multiple Lockfiles Warning

If you see a warning about multiple lockfiles, you can safely ignore it or remove the local `pnpm-lock.yaml` file in the turbo directory.

### Database Issues

If you encounter database issues:

1. Delete `packages/database/dev.db`
2. Run `cd packages/database && pnpm db:migrate`

### Port Conflicts

If ports 3000 or 3001 are in use, you can modify the ports in:

- `apps/api/package.json` (dev script)
- `apps/web/package.json` (dev script)

## Contributing

1. Make changes to the appropriate package
2. Test your changes with `./test.sh`
3. Ensure all TypeScript types are correct
4. Update this README if needed
