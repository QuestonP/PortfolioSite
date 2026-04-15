/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#050508',
        surface:  '#0c0c12',
        surface2: '#13131d',
        accent:   '#4f8ffc',
        accent2:  '#6c5ce7',
        text:     '#e8eaed',
        muted:    '#5a5f6d',
        subtle:   '#2a2d38',
        border:   'rgba(255, 255, 255, 0.06)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        body:    ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        full: '9999px',
      },
      boxShadow: {
        accent: '0 0 30px rgba(79,143,252,0.12), 0 0 60px rgba(79,143,252,0.06)',
        card:   '0 1px 0 rgba(255,255,255,0.04)',
        hard:   'inset 0 1px 0 rgba(255,255,255,0.03)',
        glow:   '0 0 40px rgba(79,143,252,0.15)',
      },
      animation: {
        'role-fade':  'roleFade 0.35s ease-out forwards',
        'reveal':     'reveal 0.5s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
        'scan':       'scan 8s linear infinite',
      },
      keyframes: {
        roleFade: {
          '0%':   { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        reveal: {
          '0%':   { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(79,143,252,0.1)' },
          '50%':      { boxShadow: '0 0 32px rgba(79,143,252,0.25)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
