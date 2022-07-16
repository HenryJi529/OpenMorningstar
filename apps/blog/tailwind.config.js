/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "apps/blog/templates/**/*.html",
    "apps/blog/static/blog/js/*.js"
  ],
  theme: {
  },
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
    themes: ["cupcake", "dark", "cmyk"],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
    require("daisyui")
  ],
}
