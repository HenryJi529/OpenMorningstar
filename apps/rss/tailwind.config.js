/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "apps/rss/templates/**/*.html",
        "apps/rss/static/rss/js/*.js"
    ],
    plugins: [
        require("daisyui"),
    ]
}
