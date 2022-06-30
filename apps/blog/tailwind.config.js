/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "apps/blog/templates/**/*.html",
    "apps/blog/static/blog/js/*.js",
    "apps/blog/**/*.py",
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
    themes: ["light", "dark", "valentine"],
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
    require("daisyui"),
  ],
}
