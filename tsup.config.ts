import path from 'path';
import { defineConfig } from 'tsup';

const env = process.env.NODE_ENV;

export default defineConfig({
  outDir: 'dist',
  entry: ['src/index.ts'],
  bundle: env === 'production',
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  external: ['@tanstack/react-query'],
  minify: env === 'production',
  watch: env === 'development',
  sourcemap: env === 'development',
  tsconfig: path.resolve(__dirname, './tsconfig.json')
});
