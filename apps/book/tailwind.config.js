/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "apps/book/templates/**/*.html",
        "apps/book/static/book/js/*.js",
    ],
    plugins: [
        require("daisyui"),
    ],
}