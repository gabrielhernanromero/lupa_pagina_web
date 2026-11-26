import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '24px',
      screens: { '2xl': '1160px' },
    },
    extend: {
      colors: {
        // Tokens de diseño Lupa
        ink: {
          DEFAULT: '#060A13', // fondo
          alt: '#0A101C', // fondo de sección alterna
        },
        surface: {
          DEFAULT: '#0D1422', // cards
          2: '#111A2B', // inputs / barras
        },
        teal: '#2DD4BF',
        sky: '#38BDF8',
        title: '#F1F5F9',
        body: '#94A3B8',
        list: '#CBD5E1',
        muted: '#64748B',
        danger: '#FCA5A5',
        line: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          soft: 'rgba(255,255,255,0.06)',
          strong: 'rgba(255,255,255,0.14)',
        },

        // Variables de shadcn/ui
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      // Solo tamaño: el interlineado se define explícitamente donde el diseño lo pide.
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
      },
      fontFamily: {
        display: ['var(--font-sora)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        brand: 'linear-gradient(90deg, #2DD4BF, #38BDF8)',
        'brand-diag': 'linear-gradient(135deg, #2DD4BF, #38BDF8)',
        'brand-diag-rev': 'linear-gradient(135deg, #38BDF8, #2DD4BF)',
      },
      maxWidth: {
        site: '1160px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        mock: '0 40px 80px rgba(0,0,0,0.45)',
        float: '0 12px 30px rgba(0,0,0,0.45)',
      },
      keyframes: {
        'lupa-breath': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(45,212,191,0)' },
          '50%': { boxShadow: '0 0 48px 0 rgba(45,212,191,0.22)' },
        },
        'lupa-float': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-6px, -8px)' },
        },
      },
      animation: {
        'lupa-breath': 'lupa-breath 4s ease-in-out infinite',
        'lupa-float': 'lupa-float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
};

export default config;
