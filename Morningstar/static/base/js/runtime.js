setInterval(() => {
    currentTime = new Date();
    initialTime = new Date("8/20/2022 8:30:00");
    interval = currentTime.getTime() - initialTime.getTime();

    dayInMillisecond = 1000 * 60 * 60 * 24;
    dayNum = Math.floor(interval / dayInMillisecond);

    hourInMillisecond = 1000 * 60 * 60;
    hourNum = Math.floor((interval % dayInMillisecond) / hourInMillisecond);

    minuteInMillisecond = 1000 * 60;
    minuteNum = Math.floor((interval % hourInMillisecond) / minuteInMillisecond);

    secondInMillisecond = 1000;
    secondNum = Math.floor((interval % minuteInMillisecond) / secondInMillisecond);

    runtime_span.innerHTML = "不温不火运行: " + dayNum + " 天 "
        + hourNum + " 小时 "
        + minuteNum + " 分 "
        + secondNum + " 秒";
}, 1000);