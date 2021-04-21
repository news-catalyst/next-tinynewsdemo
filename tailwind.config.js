module.exports = {
  purge: [ './pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}' ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        'packageLayoutDesktop': 'calc(100% / 12 * 8) calc(100% / 12 * 4)',
        'packageLayoutTablet': '50% 50%',
      },
      maxWidth: {
        '1/2': '50%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
