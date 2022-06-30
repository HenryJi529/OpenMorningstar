/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "Morningstar/templates/base/**/*.html",
        "Morningstar/static/base/js/*.js",
        "Morningstar/**/*.py"
    ],
    plugins: [
        require("daisyui"),
    ]
}