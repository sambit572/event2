export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./main.jsx",
  ],
  // theme: {
  //   extend: {
  //     keyframes: {
  //       pulseScale: {
  //         "0%, 100%": { transform: "scale(1)" },
  //         "50%": { transform: "scale(1.05)" },
  //       },
  //     },
  //     animation: {
  //       pulseScale: "pulseScale 4s ease-in-out infinite",
  //     },
  //   },
  // },
  // theme: {
  //   extend: {
  //     keyframes: {
  //       tiltScale: {
  //         "0%, 100%": {
  //           transform:
  //             "perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)",
  //         },
  //         "50%": {
  //           transform:
  //             "perspective(500px) rotateX(10deg) rotateY(10deg) scale(1.05)",
  //         },
  //       },
  //     },
  //     animation: {
  //       tiltScale: "tiltScale 5s ease-in-out infinite",
  //     },
  //   },
  // },
  theme: {},
  plugins: [],
};
