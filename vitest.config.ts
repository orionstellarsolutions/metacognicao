import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.vue', 'src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.d.ts', 'src/main.ts']
    }
  }
});
