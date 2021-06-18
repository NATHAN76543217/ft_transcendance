module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
        transitionProperty: {
            'width': 'width'
        },
        colors: {
          primary : '#b2e2eb',
          secondary : '#0000FF',
          neutral : {
            DEFAULT : '#EFEFEF',
            dark : '#AFAFAF'
          }
        }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
