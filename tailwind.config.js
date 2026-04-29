/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./app/**/*", "./components/**/*.{js,jsx,ts,tsx}"],
  // NativeWind/Tailwind can't always statically detect classes built at runtime
  // (e.g. strings returned from helper functions). Keep these badge colors available.
  safelist: ["bg-red-600", "bg-indigo-600", "bg-cyan-600"],
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