import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './stories/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        glass: {
          base: 'rgba(255, 255, 255, 0.45)',
          dark: 'rgba(15, 23, 42, 0.65)'
        },
        accent: {
          DEFAULT: '#7F5AF0',
          mint: '#2CB1BC',
          peach: '#FFB4A2'
        }
      },
      backdropBlur: {
        xs: '6px'
      },
      boxShadow: {
        glass: '0 14px 40px rgba(15, 23, 42, 0.25)'
      }
    }
  },
  plugins: []
};

export default config;
