// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main Brand Colors from PDF
        'brand-gold': 'gold',
        'brand-gold-light': '#d4b382',
        'brand-yellow-vote': '#fdd835',
        
        // Backgrounds
        'bg-dark': '#1a1a1a',
        'bg-light': '#f0f0f0',
        'card-dark': '#2c2c2c',

        // Text
        'text-light': '#ffffff',
        'text-dark': '#333333',
        'text-gold': '#b98d4a',
        'prize-red': '#ff0000',
        //whatsapp
        'brand-whatsapp': '#25D366',
        
        // Leaderboard Specific
       'leaderboard-1': '#c94a4a', // A muted red for the 1st place card
        'leaderboard-2': '#d4b382', // Gold/Tan for 2nd place
        'leaderboard-3': '#a07d53', // Brown for 3rd place
        'leaderboard-4': '#d1d5db',
        
        // Accents
        'border-dashed': '#7e57c2', // Purple dashed border for vote cards
      },
      fontFamily: {
        // Main font
        sans: ['Montserrat', 'sans-serif'],
        // Special chunky font for Leaderboard title
        display: ['Fredoka One', 'cursive'],
      },
    },
  },
  plugins: [],
};