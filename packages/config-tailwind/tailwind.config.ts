import type { Config } from 'tailwindcss';
import theme from './theme';

const config: Omit<Config, 'content'> = {
  theme,
};

export default config;
