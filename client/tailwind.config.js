/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        DMSans: ["DM Sans", "sans-serif"],
        Inter: ["Inter", "sans-serif"],
        SFPro: ["SF Pro", "sans-serif"],
        Mulish: ["Mulish", "sans-serif"],
      },

      backgroundImage: {
        header: "url('./assets/home-background.png')",
      },

      colors: {
        "main-blue": "#296EFF",
        "main-gray": "#C0C0C0",
        "main-blue-gray": "#5F6388",
        "main-light-gray": "#E1E1E1",
        "main-light-white": "#f8fafc",
        "main-turquoise": "#5bf7db",
        "main-dark-gray": "#757575",
        "main-light-purple": "#625BF7",
      },

      boxShadow: {
        "to-r": "0px 0px 24px rgba(0, 0, 0, 0.08)",
      },
    },
  },

  darkMode: "class",

  // eslint-disable-next-line no-undef
  plugins: [require("tailwind-scrollbar")],
};
