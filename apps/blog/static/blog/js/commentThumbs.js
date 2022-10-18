function processData(data, commentId, action, direction) {
    console.log(data);
    thumbsIcon = document.querySelector(`.thumbs-${direction}[data-comment_id="${commentId}"]`)
    if (action === "do") {
        thumbsIcon.classList.add("text-amber-600");
        thumbsIcon.classList.add("text-lg");
    } else {
        thumbsIcon.classList.remove("text-amber-600");
        thumbsIcon.classList.remove("text-lg");
    }

    if (data.thumbsUp_count === 0 && data.thumbsDown_count === 0) {
        document.querySelector(`#commentCountPanel${commentId}`).classList.add("hidden");
    }
    if (data.thumbsUp_count + data.thumbsDown_count === 1) {
        document.querySelector(`#commentCountPanel${commentId}`).classList.remove("hidden");
    }
    if (data.thumbsUp_count > 0 || data.thumbsDown_count > 0) {
        document.querySelector(`[data-comment_count="${commentId}-up"]`).innerText = data.thumbsUp_count;
        document.querySelector(`[data-comment_count="${commentId}-down"]`).innerText = data.thumbsDown_count;
    }
}

function execute_thumbs(commentId, action, direction) {
    fetch(thumbs_endpoint, {
        method: "POST",
        headers: {
            "X-CSRFToken": csrfToken,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            csrfmiddlewaretoken: csrfToken,
            "comment_id": commentId,
            "action": action,
            "direction": direction,
        }),
    })
        .then((res) => res.json())
        .then((data) => processData(data, commentId, action, direction));
}


document.querySelectorAll('.thumbs-up').forEach((upElement) => {
    upElement.addEventListener('click', (e) => {
        commentId = e.target.getAttribute('data-comment_id');
        action = e.target.getAttribute('data-action');
        direction = "up";
        execute_thumbs(commentId, action, direction);
        if (action === "do") {
            e.target.setAttribute('data-action', "undo");
        } else {
            e.target.setAttribute('data-action', "do");
        }
    })
})
document.querySelectorAll('.thumbs-down').forEach((upElement) => {
    upElement.addEventListener('click', (e) => {
        commentId = e.target.getAttribute('data-comment_id');
        action = e.target.getAttribute('data-action');
        direction = "down";
        execute_thumbs(commentId, action, direction);
        if (action === "do") {
            e.target.setAttribute('data-action', "undo");
        } else {
            e.target.setAttribute('data-action', "do");
        }
    })
})
