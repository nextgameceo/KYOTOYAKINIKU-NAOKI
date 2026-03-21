import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-noto-serif)', 'serif'],
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      colors: {
        naoki: {
          red: '#b01020',
          gold: '#c8a84a',
          ink: '#0a0a0a',
          washi: '#f0ebe0',
        },
      },
    },
  },
  plugins: [],
};

export default config;
