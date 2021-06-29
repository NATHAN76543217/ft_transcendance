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
            dark : '#a1dbe6'
          },
          secondary : {
            DEFAULT : '#28b9d4',
            dark : '#219db4'
          },
          neutral : {
            DEFAULT : '#efefef',
            dark : '#e3e3e3'
          },
          unset : {
            DEFAULT : '#f04545',
            dark : '#ee3636'
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
