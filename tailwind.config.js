/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./app/**/*", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        plight: ['plight', 'sans-serif'],
        pregular: ['pregular', 'sans-serif'],
        pmedium: ['pmedium', 'sans-serif'],
        psemibold: ['psemibold', 'sans-serif'],
        pbold: ['pbold', 'sans-serif'],
        pblack: ['pblack', 'sans-serif']
      }
    },
  },
  plugins: [],
}