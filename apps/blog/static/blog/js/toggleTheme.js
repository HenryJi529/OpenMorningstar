
let toggleThemeButton = document.querySelector("#toggleThemeButton");
let themeIcon = toggleThemeButton.querySelector("#themeIcon");
let html = document.querySelector("html");

// 使用localStorage-slim替代原生的localStorage
if(window.ls.get("data-theme") === "dark"){
    html.setAttribute("data-theme", "dark");
    themeIcon.classList.add("fa-moon");
}
else if(window.ls.get("data-theme") === "light"){
    html.setAttribute("data-theme", "light")
    themeIcon.classList.add("fa-sun");
}else{
    let currentHours = new Date().getHours();
    if (currentHours >= 18 || currentHours <= 4) {
        html.setAttribute("data-theme", "dark");
        themeIcon.classList.add("fa-moon");
    } else {
        html.setAttribute("data-theme", "light")
        themeIcon.classList.add("fa-sun");
    }
}


toggleThemeButton.addEventListener("click", () => {
    let currentTheme = html.getAttribute("data-theme");
    if (currentTheme === "light") {
        html.setAttribute("data-theme", "dark");
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
        window.ls.set("data-theme", "dark",{ ttl: 60*30 });
    } else {
        html.setAttribute("data-theme", "light");
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
        window.ls.set("data-theme", "light",{ ttl: 60*30 });
    }
})