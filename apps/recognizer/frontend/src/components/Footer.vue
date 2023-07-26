<script setup>
import { ref } from 'vue';

const getRunTime = () => {
    const currentTime = new Date();
    const initialTime = new Date("10/15/2022 7:30:00");
    const interval = currentTime.getTime() - initialTime.getTime();

    const dayInMillisecond = 1000 * 60 * 60 * 24;
    const dayNum = Math.floor(interval / dayInMillisecond);

    const hourInMillisecond = 1000 * 60 * 60;
    const hourNum = Math.floor((interval % dayInMillisecond) / hourInMillisecond);

    const minuteInMillisecond = 1000 * 60;
    const minuteNum = Math.floor((interval % hourInMillisecond) / minuteInMillisecond);

    const secondInMillisecond = 1000;
    const secondNum = Math.floor((interval % minuteInMillisecond) / secondInMillisecond);
    return {
        dayNum: dayNum,
        hourNum: hourNum,
        minuteNum: minuteNum,
        secondNum: secondNum
    }
}

const runTime = ref(getRunTime())

setInterval(() => {
    runTime.value = getRunTime();
}, 1000);

</script>

<template>
    <div class="fixed bottom-2 mx-auto w-full">
        <div class="text-center">
            <div id="runtime_span">不温不火运行: {{ runTime.dayNum }} 天 {{ runTime.hourNum }} 小时 {{ runTime.minuteNum }} 分钟 {{
                runTime.secondNum }} 秒</div>
            <div id="copyright">
                <span>© 2022
                    <a href="https://linktr.ee/Henry529" class="font-bold" style="font-family: Lora">Henry Ji</a>
                </span>
                <span class="brightness-0"> / </span>
                <span>License: <a href="https://www.gnu.org/licenses/agpl-3.0.en.html" class="font-bold">AGPLv3</a></span>
                <span class="brightness-0"> / </span>
                <span>Powered by <a href="https://www.djangoproject.com/" class="font-bold">Django</a></span>
            </div>
        </div>
    </div>
</template>


<style scoped></style>