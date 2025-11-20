export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        scroll: "scroll 18s linear infinite",
      },
      screens: {
        "sm-mid": { min: "420px", max: "639px" }, // custom range
      },
      colors: {
        aceeff: "#ACEEFF",
        green92: "#92FF5C", // or any name you prefer
        voilet32: "#E9FF70", // or any name you prefer
        purple32: "#80FFDB", // or any name you prefer
      },
    },
  },
  plugins: [],
};
