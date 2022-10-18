let masonryGrid = document.querySelector('#masonryGrid');
window.onload = () => {
    // console.log("ok...")
    var masonry = new Masonry(masonryGrid, {
        itemSelector: '.masonry-item',
    });
}
