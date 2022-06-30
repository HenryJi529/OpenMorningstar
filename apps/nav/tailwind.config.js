/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "apps/nav/templates/**/*.html",
        "apps/nav/static/nav/js/*.js"
    ],
    plugins: [
        require("daisyui"),
    ]
}
