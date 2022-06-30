let timer = null;

const generateStep = (startTime, totalTime, totalScrollTop) => {
    const step = () => {
        let nowTime = Number(new Date());
        let runTime = nowTime - startTime;
        let remainTime = startTime - nowTime + totalTime;
        let nextScrollTop = totalScrollTop - (runTime / totalTime) * totalScrollTop
        document.documentElement.scrollTop = nextScrollTop;
        timer = requestAnimationFrame(step);
        if (runTime >= totalTime) {
            cancelAnimationFrame(timer);
        }
    }
    return step;
}


document.querySelector("#scrollBox").onclick = () => {
    //获取当前毫秒数
    let startTime = Number(new Date());
    //获取当前页面的滚动高度
    let totalScrollTop = document.documentElement.scrollTop;
    let totalTime = 500;
    timer = requestAnimationFrame(generateStep(startTime, totalTime, totalScrollTop));
}