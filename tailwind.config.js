module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "247-main": "#212427",
        "247-secondary": "#282C31",
        "247-transparent": "#FFFFFF",
        "247-dark-text": "#4D4D4D",
        "247-error-text": "#FF9494",
        "247-inactive-link": "#959698",
        "247-dark-accent1": "#454545",
        "247-dark-accent2": "#4C4C4C",
        "247-gray-accent2": "#CACACA",
        "247-gray": "#EBEBEB",
        "247-accent1": "#282C31",
        "247-green": "#4FB81D",
        "247-red": "rgba(255, 0, 0, 0.6)",
      },
      backgroundImage: {
        "subtle-curve": "url('/src/assets/subtle-curve.svg')",
        "subtle-red-curve": "url('/src/assets/subtle-red-curve.svg')",
      },
    },
    fontFamily: {
      customRoboto: ["Roboto", "sans-serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
