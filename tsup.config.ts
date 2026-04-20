import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],

  // 🔑 THIS is where tsconfig goes
  tsconfig: 'tsconfig.dts.json',

  dts: true,

  external: ['react', 'react-dom', 'react-router-dom'],
  clean: true,
  target: 'es2020'
});
