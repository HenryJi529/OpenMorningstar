document.querySelector("#showAllCommentButton").addEventListener("click", (evt) => {
    evt.target.parentNode.classList.add("hidden");
    document.querySelectorAll(".comment-item").forEach((element) => {
        element.classList.remove("hidden");
    })
})