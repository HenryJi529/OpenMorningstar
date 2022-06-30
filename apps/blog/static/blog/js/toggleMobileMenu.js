const menuButton = document.querySelector('#menuButton');
const toggleMobileMenuCheckbox = document.querySelector('#toggleMobileMenuCheckbox');
const mainContent = document.querySelector('#mainContent');
const sideContent = document.querySelector('#sideContent');
const widgetArray = Array.from(sideContent.querySelectorAll('.widget'));

menuButton.addEventListener('click', () => {
    if (toggleMobileMenuCheckbox.checked) {
        // 显示状态
        mainContent.classList.add('hidden');
        sideContent.classList.remove('hidden');
        // 显示样式
        sideContent.classList.add('px-16');
        widgetArray.forEach(widget => {
            widgetToggle = widget.querySelector('.widget-toggle');
            widgetTitle = widget.querySelector('.widget-title');
            widgetList = widget.querySelector('.widget-list');
            widget.classList.add('collapse');
            widget.classList.remove('p-2');
            widgetToggle.classList.remove('hidden');
            widgetTitle.classList.add('collapse-title');
            widgetList.classList.add('collapse-content');
        });
    } else {
        // 显示状态
        mainContent.classList.remove('hidden');
        sideContent.classList.add('hidden');
        // 显示样式
        sideContent.classList.remove('px-16');
        widgetArray.forEach(widget => {
            widgetToggle = widget.querySelector('.widget-toggle');
            widgetTitle = widget.querySelector('.widget-title');
            widgetList = widget.querySelector('.widget-list');
            widget.classList.remove('collapse');
            widget.classList.add('p-2');
            widgetToggle.classList.add('hidden');
            widgetTitle.classList.remove('collapse-title');
            widgetList.classList.remove('collapse-content');
        });
    }
});
