/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "apps/joke/templates/**/*.html",
        "apps/joke/static/joke/js/*.js",
    ],
    plugins: [
        require("daisyui"),
    ],
}