module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      transitionProperty: {
        'width': 'width'
      },
      colors: {
        primary: {
          DEFAULT: '#b2e2eb',
          dark: '#7ab6c2'
        },
        secondary: {
          DEFAULT: '#28b9d4',
          dark: '#24a6be'
        },
        neutral: {
          DEFAULT: '#efefef',
          dark: '#e3e3e3'
        },
        unset: {
          DEFAULT: '#f04545',
          dark: '#d83e3e'
        },
        test: {
          DEFAULT: '#d83e3e',
          dark: '#d83e3e'
        },
        pending: {
          DEFAULT: '#c1d2e3',
          dark: '#a4bdd5'
        },
        accept: {
          DEFAULT: '#50d97e',
          dark: '#37d36c'
        },
        app: {
          DEFAULT: 'gray-200'
        }
      },
      spacing: {
        '16/9': '178%',

      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
    variants: {
      extend: {},
    },
    // plugins: [require('@tailwindcss/forms')],
  }
