/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,md,html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F1114",
        "bg-soft": "#f7f8fa",
        muted: "#5f6672",
        line: "#e5e7eb",
        dark: "#0f1114",
      },
      fontFamily: {
        heading: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
      maxWidth: {
        container: "1180px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
