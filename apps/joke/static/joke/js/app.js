let masonryGrid = document.querySelector('#masonryGrid');
let progressBarContainer = document.querySelector('#progressBarContainer');
window.onload = () => {
    // console.log("ok...window is onload...");
    progressBarContainer.classList.add('hidden');
    var masonry = new Masonry(masonryGrid, {
        itemSelector: '.masonry-item',
    });
}
