/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // every corner in the project is 7px
    borderRadius: {
      none: '0',
      sm: '7px',
      DEFAULT: '7px',
      md: '7px',
      lg: '7px',
      xl: '7px',
      '2xl': '7px',
      '3xl': '7px',
      full: '7px',
    },
    extend: {
      colors: {
        ink: '#0B0B0B',
        maroon: '#6B1F2A',
        beige: '#E9DFCF',
        // themed per section (see styles/index.css)
        bg: token('bg'),
        fg: token('fg'),
        accent: token('accent'),
        mute: token('mute'),
        card: token('card'),
        onaccent: token('onaccent'),
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
