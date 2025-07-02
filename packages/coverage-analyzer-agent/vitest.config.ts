import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  root: __dirname,
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/cli.ts' // CLI entry point は除外
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/types': resolve(__dirname, './src/types'),
      '@/analyzers': resolve(__dirname, './src/analyzers'),
      '@/llm-integration': resolve(__dirname, './src/llm-integration'),
      '@/reporters': resolve(__dirname, './src/reporters')
    }
  },
  css: {
    postcss: false
  }
});