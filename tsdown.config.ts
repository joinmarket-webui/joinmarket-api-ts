import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/**/*.ts'],
  platform: 'neutral',
  format: ['esm'],
  dts: true,
  clean: true,
  unbundle: true,
  deps: {
    neverBundle: ['@tanstack/react-query'],
  },
  target: false,
});
