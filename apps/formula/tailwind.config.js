/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "apps/formula/templates/**/*.html",
        "apps/formula/static/formula/js/*.js",
    ],
    plugins: [
        require("daisyui"),
    ],
}