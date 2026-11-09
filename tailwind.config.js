/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#080808',
        charcoal: '#151515',
        gold: { DEFAULT: '#C6A56B', soft: '#E8D8B8', deep: '#8F7440' },
        champagne: '#E8D8B8',
        ivory: '#F5F0E7',
        dim: '#777777',
        mute: '#A39E94',
        alert: '#C0524A',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
      },
      letterSpacing: { wider2: '0.28em', wider3: '0.4em' },
    },
  },
  plugins: [],
};
