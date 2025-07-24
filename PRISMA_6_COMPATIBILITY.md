# Prisma 6.x and Turbo Repo Compatibility Updates

This document outlines the changes made to ensure compatibility with the latest Prisma 6.12.0 and Turbo repo.

## Issues Addressed

### 1. GitHub Issue #142: "No dmmf available from new prisma client generator"

**Problem**: Newer Prisma versions changed how DMMF is accessed.

**Solution**:

- Created a robust `getDMMF()` function in `src/dmmf.ts` that handles different Prisma versions
- Updated both `src/extension.ts` and `src/middleware.ts` to use the new function
- Added fallback patterns for both old and new DMMF access methods
- Exported `getDMMF` function for custom usage

### 2. GitHub Issue #128: "TURBO REPO (Error: [prisma-field-encryption] Error: no encryption key provided.)"

**Problem**: Turbo repo doesn't pass environment variables properly to child processes.

**Solution**:

- Enhanced environment variable handling in `src/encryption.ts`
- Added support for multiple environment variable names for better compatibility
- Added Turbo repo-specific error messages with helpful configuration examples
- Added documentation for Turbo repo configuration

### 3. GitHub Issue #140: "Windows Path Issue in Generated Import Statements"

**Problem**: Generator was using Unix-only path handling.

**Solution**:

- Replaced `path/posix` with `node:path` for cross-platform compatibility
- Added Windows path normalization in generated import statements
- Ensured generated code works on both Unix and Windows systems

## Updated Dependencies

```json
{
  "devDependencies": {
    "@prisma/client": "6.12.0",
    "@prisma/generator-helper": "6.12.0",
    "@prisma/internals": "6.12.0",
    "prisma": "6.12.0"
  },
  "peerDependencies": {
    "@prisma/client": ">= 4.7, < 7.0"
  }
}
```

## Key Changes Made

### 1. DMMF Access (`src/dmmf.ts`)

```typescript
export function getDMMF() {
  try {
    // Try the new Prisma 6+ pattern first
    const { Prisma } = require('@prisma/client')
    if (Prisma.dmmf) {
      return Prisma.dmmf
    }

    // Fallback to the old pattern
    return require('@prisma/client').Prisma.dmmf
  } catch (error) {
    throw new Error(
      `[prisma-field-encryption] Could not access Prisma DMMF. This might be due to:
1. Prisma client not being generated (run 'prisma generate')
2. Incompatible Prisma version
3. Custom Prisma client location not properly configured

Error: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
```

### 2. Enhanced Environment Variable Handling (`src/encryption.ts`)

```typescript
export function configureKeys(config: Configuration): KeysConfiguration {
  // Enhanced environment variable handling for Turbo repo compatibility
  const encryptionKey =
    config.encryptionKey ||
    process.env.PRISMA_FIELD_ENCRYPTION_KEY ||
    process.env.PRISMA_FIELD_ENCRYPTION_KEY_OVERRIDE

  if (!encryptionKey) {
    // Provide more helpful error message for Turbo repo users
    const errorMessage = process.env.TURBO_REPO
      ? `${errors.noEncryptionKey}

Turbo Repo detected. Make sure to:
1. Add PRISMA_FIELD_ENCRYPTION_KEY to your turbo.json globalEnv or task-specific env
2. Or set it in your .env file
3. Or pass it directly in the configuration

Example turbo.json:
{
  "globalEnv": ["PRISMA_FIELD_ENCRYPTION_KEY"]
}`
      : errors.noEncryptionKey

    throw new Error(errorMessage)
  }
  // ... rest of the function
}
```

### 3. Cross-Platform Path Handling (`src/generator/main.ts`)

```typescript
// Changed from path/posix to node:path
import path from 'node:path'

// Added Windows path normalization
const prismaClientModule = prismaClientOutput.endsWith(
  'node_modules/@prisma/client'
)
  ? '@prisma/client'
  : path.relative(outputDir, prismaClientOutput).replace(/\\/g, '/')
```

## Documentation Updates

### README.md Updates

- Updated Prisma version compatibility section
- Added Turbo repo compatibility section with configuration examples
- Updated peer dependency range to support Prisma 6.x

### Turbo Repo Configuration Example

```json
{
  "globalEnv": ["PRISMA_FIELD_ENCRYPTION_KEY", "PRISMA_FIELD_DECRYPTION_KEYS"]
}
```

Or for specific tasks:

```json
{
  "pipeline": {
    "build": {
      "env": ["PRISMA_FIELD_ENCRYPTION_KEY"]
    }
  }
}
```

## Testing

All existing tests pass with Prisma 6.12.0:

- ✅ Type checking
- ✅ Unit tests (28/28 passing)
- ✅ Build process with tsup
- ✅ Cross-platform compatibility

## Migration Guide

### For Existing Users

1. Update your Prisma dependencies to 6.x
2. If using Turbo repo, add environment variables to `turbo.json`
3. No code changes required - the library is backward compatible

### For New Users

1. Install the latest version
2. Follow the README for setup instructions
3. If using Turbo repo, see the Turbo repo compatibility section

## Breaking Changes

None. This update maintains full backward compatibility while adding support for newer versions.

## Future Considerations

- Monitor Prisma 7.x compatibility when it's released
- Consider adding support for additional field types (JSON, Bytes) as requested in issues #11 and #26
- Evaluate the v2 cryptographic design mentioned in RFC #54
