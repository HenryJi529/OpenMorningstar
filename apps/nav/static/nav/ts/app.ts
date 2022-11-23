// 滑动检测
const isMobile = /Android|iPhone/i.test(navigator.userAgent) ? true : false;
if (isMobile) {
    setInterval(() => {
        if (document.documentElement.scrollTop > 90) {
            document.querySelector('#headBarTitle')?.classList.add('hidden');
            document.querySelector('#headBarNav')?.classList.add('py-2');
        } else {
            document.querySelector('#headBarTitle')?.classList.remove('hidden');
            document.querySelector('#headBarNav')?.classList.remove('py-2');
        }
    }, 200);
}