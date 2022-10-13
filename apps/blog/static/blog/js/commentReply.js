const replyButtonList = document.querySelectorAll('.reply-button');
// import textarea from './commentPreview.js'; # NOTE: 
replyButtonList.forEach((replyButton) => {
    replyButton.addEventListener('click', (event) => {
        let selectCommentUsername = event.target.parentNode.parentNode.childNodes[1].childNodes[1].innerText;
        textarea.value = textarea.value + `[@${selectCommentUsername}](#comment-${event.target.getAttribute("data-comment_id")})`;
    });
})