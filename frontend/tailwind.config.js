module.exports = {
  content: ['./index.html', './src/**/*', './src/**/*.{html, js, ts, tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    screens: {
      'mobile': '420px',
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px',
    },
    fontFamily: {
      sans: ['SF Pro Display', 'sans-serif'],
    },
    extend: {
      fontSize: {
        '1xs': '11px'
      },
      colors: {
        'indigo-900': '#363452',
        'indigo-950': '#2D2B44',
        'indigo-1000': '#222133',
        'indigo-1100': '#181727'
      },
      height: {
        '60px': '60px',
        '20rem': '20rem',
        '25rem': '25rem',
      },
      maxWidth: {
        '16rem': '16rem'
      },
      minWidth: {
        '15rem': '15rem'
      },
      maxHeight: {
        '90vh': '90vh',
        '80vh': '80vh',
        '70vh': '70vh',
        '85%': '85%',
      },
      minHeight: {
        '10rem': '10rem',
        '18rem': '18rem',
        '24rem': '24rem',
        '80%': '80%',
      },
      width: {
        '20rem': '20rem',
        '30rem': '30rem',
        '40rem': '40rem'
      },
      padding: {
        '6%': '6%',
        '60px': '60px',
        '20%': '20%',
        '10%': '10%',
      },
      zIndex: {
        '9999': '9999'
      },
    },
    default: {
      button: {
        '&:disabled': {
          cursor: 'not-allowed',
          opacity: 0.4,
        }
      }
    }
  },
  variants: {
    cursor: ['hover', 'focus'],
    backgroundColor: ['hover', 'focus', 'important', 'responsive', 'dark'],
    backgroundSize: ['important', 'responsive'],
    backgroundRepeat: ['important', 'responsive'],
    backgroundPosition: ['important', 'responsive'],
    margin: ['first', 'responsive'],
    display: ['responsive'],
    padding: ['important', 'responsive'],
    borderRadius: ['important', 'responsive'],
    textColor: ['important', 'group-hover', 'hover', 'dark'],
    borderColor: ['important', 'focus', 'hover', 'dark'],
    outlineOffset: ['hover'],
    boxShadow: ['responsive', 'dark'],
    border: ['hover', 'responsive'],
    extend: {
      ringColor: ['focus', 'important'],
      ring: ['focus', 'important'],
      cursor: ['disabled'],
      opacity: ['disabled', 'readonly'],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require("tailwindcss-animation-delay"),
    require('tailwindcss-text-fill-stroke')(),
  ]
}
