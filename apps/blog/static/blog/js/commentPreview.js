let textarea = document.querySelector('textarea.auto-expend');
let commentPreview = document.querySelector('#commentPreview');

// textarea长度自适应
textarea.addEventListener('keydown', (e) => {
    setTimeout(() => {
        if (e.target.scrollHeight > 112) {
            e.target.style.height = e.target.scrollHeight + 'px';
        }
    }, 0);
});

// 编辑与预览更换
document.querySelector('#editorButton').addEventListener('click', (evt) => {
    textarea.classList.remove('hidden');
    commentPreview.classList.add('hidden');
})
document.querySelector('#previewButton').addEventListener('click', (evt) => {
    textarea.classList.add('hidden');
    commentPreview.classList.remove('hidden');
})

// 预览
textarea.addEventListener('change', () => {
    commentPreview.innerHTML = marked.parse(textarea.value);
    commentPreview.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
    });
})
