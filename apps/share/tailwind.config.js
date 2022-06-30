/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "apps/share/templates/**/*.html",
        "apps/share/static/share/js/*.js"
    ],
    plugins: [
        require("daisyui"),
    ]
}