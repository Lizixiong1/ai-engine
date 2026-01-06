import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: 'es2020',
  outDir: 'dist',
  clean: true,
  dts: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  external: ['react'],
  banner: {
    js: "'use client';",
  },
});