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
        "247-box-border": "#6F6F6F",
        "247-error-text": "rgb(212, 5, 17)",
        "247-inactive-link": "#959698",
        "247-dark-accent1": "#454545",
        "247-dark-accent2": "#4C4C4C",
        "247-gray-accent2": "#CACACA",
        "247-gray-accent3": "#383B3E",
        "247-gray-accent4": "#444444",
        "247-gray-accent5": "#979797",
        "247-gray": "#EBEBEB",
        "247-accent1": "#282C31",
        "247-green": "#4FB81D",
        "247-increment-green": "#028307",
        "247-decrement-red": "#A00000",
        "247-red": "rgba(255, 0, 0, 0.6)",
      },
      backgroundImage: {
        "subtle-curve": "url('/src/assets/subtle-curve.svg')",
        "subtle-red-curve": "url('/src/assets/subtle-red-curve.svg')",
        "blue-gradient":
          "linear-gradient(180deg, #66B0F0 0.5%, rgba(94, 174, 244, 0.9) 100%)",
        "green-gradient":
          "linear-gradient(180deg, #21A0AA 0%, rgba(10, 145, 156, 0.76) 100%)",
        "yellow-gradient":
          "linear-gradient(180deg, #F7BC13 0%, rgba(214, 158, 0, 0.76) 100%)",
        "orange-gradient":
          "linear-gradient(180deg, #EF8428 0%, rgba(242, 100, 20, 0.83) 100%)",
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
