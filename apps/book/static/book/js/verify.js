function processData(data, content) {
    console.log(data);
    if (data.status === "success") {
        linkElement = document.createElement("a");
        linkElement.setAttribute("href", data.uri);
        linkElement.setAttribute("target", "_blank");
        linkElement.classList.add("inline-block");
        linkElement.classList.add("pl-2");
        linkElement.innerHTML = `${data.book_name}(${data.author})`;

        linkIcon = document.createElement("i");
        linkIcon.classList.add("fa-solid");
        linkIcon.classList.add("fa-link");

        linkContainer = document.createElement("div");
        linkContainer.classList.add("text-center");
        linkContainer.classList.add("p-4");
        linkContainer.classList.add("text-lg");
        linkContainer.appendChild(linkIcon);
        linkContainer.appendChild(linkElement);

        content.appendChild(linkContainer);
    } else {
        alert("请刷新网页后再次尝试");
    }
}

function openModal(bookId) {
    let modalId = 'my_modal_' + bookId;
    document.getElementById(modalId).showModal();
    let content = document.querySelector('#' + modalId).querySelector(".modal-content");
    fetch(verifyUrl, {
        "method": "POST",
        "headers": {
            "X-CSRFToken": csrfToken,
            "content-type": "application/json",
        },
        "body": JSON.stringify({
            "csrfmiddlewaretoken": csrfToken,
            "bookId": content.getAttribute("data-bookId"),
        })
    }).then(res => res.json()).then(data => processData(data, content))
}


