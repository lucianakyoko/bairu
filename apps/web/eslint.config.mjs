import { defineConfig, globalIgnores } from 'eslint/config';
import sharedConfig from '@bairu/config-eslint/next';

export default defineConfig([
  ...sharedConfig,

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
