const myModalBox = document.querySelector('#myModalBox');


function processData(data, submitVerifyInterval) {
    // console.log(data.status);
    if (data.status === "success") {
        clearInterval(submitVerifyInterval);

        linkContainer = document.createElement("div");
        linkElement = document.createElement("a");
        linkIcon = document.createElement("i");

        linkIcon.classList.add("fa-solid");
        linkIcon.classList.add("fa-link");

        linkContainer.classList.add("text-center");
        linkContainer.classList.add("p-4");
        linkContainer.classList.add("text-lg");

        linkElement.setAttribute("href", data.uri);
        linkElement.setAttribute("target", "_blank");
        linkElement.classList.add("inline-block");
        linkElement.classList.add("pl-2");
        linkElement.innerHTML = `${data.book_name}(${data.author})`;

        linkContainer.appendChild(linkIcon);
        linkContainer.appendChild(linkElement);
        myModalBox.appendChild(linkContainer);

        document.querySelector(".g-recaptcha").style.display = "none";
    } else {

    }
}

document.querySelectorAll('.modal-button').forEach(button => {
    button.addEventListener('click', () => {
        let submitVerifyInterval = setInterval(() => {
            if (document.querySelector("#g-recaptcha-response").value) {
                fetch(verifyUrl, {
                    "method": "POST",
                    "headers": {
                        "X-CSRFToken": csrfToken,
                        "content-type": "application/json",
                    },
                    "body": JSON.stringify({
                        "csrfmiddlewaretoken": csrfToken,
                        "g-recaptcha-response": document.querySelector("#g-recaptcha-response").value,
                        "bookId": button.getAttribute("data-bookId"),
                    })
                }).then(res => res.json()).then(data => processData(data, submitVerifyInterval))
            }
        }, 2000);
        document.querySelector("#myModalToggle").addEventListener("click", () => {
            clearInterval(submitVerifyInterval)
        })
    })
})


