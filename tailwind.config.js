/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:        '#08090B',
        surface:   '#0E0F12',
        surface2:  '#15171B',
        surface3:  '#1C1F24',
        accent:    '#7C86FF',
        accent2:   '#9AA2FF',
        text:      '#ECEDEE',
        muted:     '#A1A1AA',
        muted2:    '#71717A',
        muted3:    '#52525B',
        success:   '#4ADE80',
        warn:      '#FBBF24',
        border:    'rgba(255, 255, 255, 0.06)',
        border2:   'rgba(255, 255, 255, 0.09)',
      },
      fontFamily: {
        display: ['"Inter"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        serif:   ['"Fraunces"', 'serif'],
      },
      fontSize: {
        xs:   ['12px', { lineHeight: '16px', letterSpacing: '0.01em' }],
        sm:   ['13px', { lineHeight: '20px' }],
        base: ['15px', { lineHeight: '24px' }],
        lg:   ['17px', { lineHeight: '26px' }],
        xl:   ['20px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        '2xl':['24px', { lineHeight: '32px', letterSpacing: '-0.015em' }],
        '3xl':['32px', { lineHeight: '40px', letterSpacing: '-0.02em' }],
        '4xl':['44px', { lineHeight: '52px', letterSpacing: '-0.025em' }],
        '5xl':['64px', { lineHeight: '68px', letterSpacing: '-0.03em' }],
        '6xl':['88px', { lineHeight: '90px', letterSpacing: '-0.035em' }],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '6px',
        lg: '10px',
        full: '9999px',
      },
      boxShadow: {
        card:  '0 1px 0 rgba(255,255,255,0.04)',
        paper: '0 30px 60px -20px rgba(0,0,0,0.6), 0 12px 24px -10px rgba(0,0,0,0.4)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
