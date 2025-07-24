import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    // Main library entry point
    index: 'src/index.ts',
    // Generator entry point (CLI tool)
    'generator/main': 'src/generator/main.ts'
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  // Ensure the generator binary is executable
  onSuccess: 'chmod +x dist/generator/main.js',
  // External dependencies that shouldn't be bundled
  external: [
    '@prisma/client',
    '@prisma/generator-helper',
    '@47ng/cloak',
    '@47ng/codec',
    'debug',
    'immer',
    'object-path',
    'zod'
  ],
  // Node.js specific settings
  platform: 'node',
  target: 'node16',
  // Keep the shebang in the generator
  esbuildOptions(options) {
    if (
      options.entryPoints &&
      typeof options.entryPoints === 'object' &&
      'generator/main' in options.entryPoints
    ) {
      options.banner = {
        js: '#!/usr/bin/env node'
      }
    }
  }
})
