import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#020408',
        cyan: '#00D4FF',
        purple: '#7B2FFF',
        green: '#00FF94',
        warning: '#FF6B35',
        muted: '#8892A4'
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        glass: '0 24px 80px rgba(0, 212, 255, 0.14)',
        neon: '0 0 32px rgba(0, 212, 255, 0.35)'
      },
      backgroundImage: {
        noise:
          'radial-gradient(circle at top, rgba(0,212,255,0.12), transparent 32%), radial-gradient(circle at bottom, rgba(123,47,255,0.12), transparent 28%)'
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        orbit: 'orbit 16s linear infinite',
        pulseRing: 'pulseRing 2s ease-out infinite',
        drift: 'drift 12s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(180px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(180px) rotate(-360deg)' }
        },
        pulseRing: {
          '0%': { transform: 'scale(0.2)', opacity: '0.9' },
          '100%': { transform: 'scale(1.8)', opacity: '0' }
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-12px,0)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
