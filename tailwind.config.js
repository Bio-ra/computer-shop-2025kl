/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#003366',
        'primary-dark': '#002244',
        'secondary': '#8989e0',
        'secondary-dark': '#7f7fe0',
        'header-bg': '#6f6fd2',
        'accent': '#ffd700',
        'text-light': '#e5e5e1',
        'text-muted': '#bcbcb7',
        'text-dark': '#181817',
      },
      fontFamily: {
        'serif': ['Merriweather', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

