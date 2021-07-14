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
          primary : {
            DEFAULT : '#b2e2eb',
            dark : '#7ab6c2'
          },
          secondary : {
            DEFAULT : '#28b9d4',
            dark : '#24a6be'
          },
          neutral : {
            DEFAULT : '#efefef',
            dark : '#e3e3e3'
          },
          unset : {
            DEFAULT : '#f04545',
            dark : '#d83e3e'
          },
          test : {
            DEFAULT : '#d83e3e',
            dark : '#d83e3e'
          },
          pending : {
            DEFAULT : '#c1d2e3',
            dark : '#a4bdd5'
          },
          accept : {
            DEFAULT : '#50d97e',
            dark : '#37d36c'
          },
        }
    },
  },
  variants: {
    extend: {},
  },
  // plugins: [require('@tailwindcss/forms')],
}
