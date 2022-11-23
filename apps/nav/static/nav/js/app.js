"use strict";
// 滑动检测
const isMobile = /Android|iPhone/i.test(navigator.userAgent) ? true : false;
if (isMobile) {
    setInterval(() => {
        var _a, _b, _c, _d;
        if (document.documentElement.scrollTop > 90) {
            (_a = document.querySelector('#headBarTitle')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
            (_b = document.querySelector('#headBarNav')) === null || _b === void 0 ? void 0 : _b.classList.add('py-2');
        }
        else {
            (_c = document.querySelector('#headBarTitle')) === null || _c === void 0 ? void 0 : _c.classList.remove('hidden');
            (_d = document.querySelector('#headBarNav')) === null || _d === void 0 ? void 0 : _d.classList.remove('py-2');
        }
    }, 200);
}
