
let toggleThemeButton = document.querySelector("#toggleThemeButton");
let themeIcon = toggleThemeButton.querySelector("#themeIcon");
let html = document.querySelector("html");

// 使用localStorage-slim替代原生的localStorage
if(window.ls.get("darkMode") === "true"){
    html.setAttribute("data-theme", "dark");
    html.classList.add("dark");
    themeIcon.classList.add("fa-moon");
}
else if(window.ls.get("darkMode") === "false"){
    html.setAttribute("data-theme", "light");
    html.classList.add("light");
    themeIcon.classList.add("fa-sun");
}else{
    let currentHours = new Date().getHours();
    if (currentHours >= 18 || currentHours <= 4) {
        html.setAttribute("data-theme", "dark");
        html.classList.add("dark");
        themeIcon.classList.add("fa-moon");
    } else {
        html.setAttribute("data-theme", "light");
        html.classList.add("light");
        themeIcon.classList.add("fa-sun");
    }
}

toggleThemeButton.addEventListener("click", () => {
    if (html.classList.contains("light")) {
        html.setAttribute("data-theme", "dark");
        html.classList.add("dark");
        html.classList.remove("light");
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        window.ls.set("darkMode", "true",{ ttl: 60*30 });
    } else {
        html.setAttribute("data-theme", "light");
        html.classList.add("light");
        html.classList.remove("dark");
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        window.ls.set("darkMode", "false",{ ttl: 60*30 });
    }
})