/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Minecraft", "Pixelify Sans", "ui-sans-serif", "system-ui"],
        display: ["Minecraft", "Pixelify Sans", "ui-sans-serif", "system-ui"],
        pixel: ["Minecraft", "Pixelify Sans", "ui-sans-serif", "system-ui"]
      },
      colors: {
        dex: {
          red: "#d92f34",
          redDark: "#9f1f2f",
          dark: "#151927",
          panel: "#fff7e6",
          screen: "#d8fff2",
          ink: "#142033"
        }
      },
      boxShadow: {
        dex: "0 30px 90px rgba(43, 14, 20, 0.24)"
      }
    }
  },
  plugins: []
};
