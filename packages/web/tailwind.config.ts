/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';
import {colors as customColors} from './src/constants/colors';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      ...colors,
      ...customColors.light
    },
    extend: {}
  },
  plugins: []
};
