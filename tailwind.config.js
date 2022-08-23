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
        "247-dark-accent3": "#161616",
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
        "247-red-straight": "#FF0000",
        "247-red-shade": "#FE0000",
        "247-dark-mode-input-bg": "rgba(0, 0, 0, 0.25)",
        "247-dotted-border": "rgba(196, 226, 250, 0.24)",
        "247-upload-bg": "rgba(247, 247, 247, 0.1)",
        "247-placeholder-shade": "#DFDFDF",
        "247-overlay": "rgba(0, 0, 0, 0.75)",
        "247-overlay-2": "rgba(0, 0, 0, 0.92)",
        "247-tab-bg": "#222222",
        "247-campaign-preview": "#131313",
        "247-campaign-preview-title": "#F50606",
        "247-timestamp-color": "#A7A7A7",
        "247-inactive-btn": "#CFCECE",
        "247-not-live": "#FF6B00",
        "247-disabled-input": "rgba(255, 255, 255, 0.5)",
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
        "active-gradient":
          "linear-gradient(180deg, #028307 0%, rgba(12, 136, 17, 0.64) 100%)",
        "closed-gradient":
          "linear-gradient(180deg, #E20000 0%, rgba(116, 7, 0, 0.64) 100%)",
        "paused-gradient":
          "linear-gradient(180deg, #EC5500 0%, rgba(180, 75, 0, 0.64) 100%)",
      },
    },
    fontFamily: {
      customRoboto: ["Roboto", "sans-serif"],
    },
  },
  variants: {
    extend: {
      backgroundColor: ["odd", "even", "disabled"],
      textColor: ["disabled"],
      cursor: ["disabled"],
      borderRadius: ["first", "last"],
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
