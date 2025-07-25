# Import Examples with @ Alias

This document shows how to use the `@` alias for cleaner imports in the Next.js todo application.

## Configuration

The `@` alias is configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Import Examples

### Before (Relative Imports)

```typescript
// API routes
import prisma from '../../../lib/prisma'
import prisma from '../../../../lib/prisma'

// Components
import { SomeComponent } from '../../components/SomeComponent'
import { utils } from '../../../utils/helpers'
```

### After (@ Alias)

```typescript
// API routes
import prisma from '@/lib/prisma'

// Components
import { SomeComponent } from '@/components/SomeComponent'
import { utils } from '@/utils/helpers'
```

## Current Usage in the Todo App

### API Routes

```typescript
// src/app/api/todos/route.ts
import prisma from '@/lib/prisma'

// src/app/api/todos/[id]/route.ts
import prisma from '@/lib/prisma'
```

### Prisma Client

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@/generated/prisma'
```

## Benefits

1. **Cleaner imports**: No need to count directory levels with `../`
2. **Easier refactoring**: Moving files doesn't break imports
3. **Better readability**: Clear indication of where imports come from
4. **Consistent structure**: All imports follow the same pattern

## Best Practices

1. **Use `@` for internal imports**: Always use `@/` for files within the `src` directory
2. **Keep external imports as-is**: Don't change imports for external packages
3. **Be consistent**: Use the same pattern throughout the codebase

## File Structure Reference

```
src/
├── app/
│   ├── api/
│   │   └── todos/
│   │       ├── route.ts          # Uses @/lib/prisma
│   │       └── [id]/
│   │           └── route.ts      # Uses @/lib/prisma
│   ├── todos/
│   │   └── page.tsx              # No relative imports needed
│   ├── layout.tsx                # No relative imports needed
│   └── page.tsx                  # No relative imports needed
├── generated/
│   └── prisma/                   # Generated Prisma client
└── lib/
    └── prisma.ts                 # Uses @/generated/prisma
```
