/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat-Regular'],
        'montserrat-thin': ['Montserrat-Thin'],
        'montserrat-extralight': ['Montserrat-ExtraLight'],
        'montserrat-light': ['Montserrat-Light'],
        'montserrat-medium': ['Montserrat-Medium'],
        'montserrat-semibold': ['Montserrat-SemiBold'],
        'montserrat-bold': ['Montserrat-Bold'],
        'montserrat-extrabold': ['Montserrat-ExtraBold'],
        'montserrat-black': ['Montserrat-Black'],
      },
    },
  },
  plugins: [],
};