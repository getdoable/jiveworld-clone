/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        jw: {
          blue: '#3aa7d4',
          ink: '#1f2933',
          orange: '#e8833a',
          purple: '#8b3fd6',
          gold: '#f2c849',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
