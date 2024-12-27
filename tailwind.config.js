const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|dropdown|input|ripple|spinner|menu|divider|popover|form).js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8',
        accent: '#75148f',
        background: '#000000',
        secondary: '#d1d1d1',
      }
    }
  },
  plugins: [nextui()],
};
