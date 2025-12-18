import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    './src/index.ts',
    // 'src/lib/index.ts',
    // 'src/utils/index.ts',
    // 'src/hooks/index.ts',
    // 'src/constants/index.ts',
  ],
  format: ['esm'],
  dts: {
    compilerOptions: {
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      types: [],
    },
  },
  clean: true,
  // sourcemap: true,
  minify: true, // keep readable for internal use
  outDir: 'dist',
  splitting: false,
  keepNames: true,
  treeshake: true,
  external: ['react', 'react-dom', 'react-router-dom'],
  onSuccess: 'copyfiles -u 1 "src/styles/**/*.css" dist',
  ignoreWatch: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', 'src/__tests__'],
  target: 'es2020',
});