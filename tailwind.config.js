tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      // Aquí puedes añadir tus personalizaciones sin sobreescribir el tema base.
    },
  },
  plugins: [],
};
