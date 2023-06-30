<script setup>
import axios from "axios";
axios.defaults.baseURL = process.env.BASE_URL

import { ref, watch, onMounted } from 'vue'
import gsap from 'gsap'
import NSpin from 'naive-ui'

import Card from '../components/Card.vue'

const quizzes = ref(null)

onMounted(async () => {
    const response = await axios.get("/");
    quizzes.value = response.data;
})

const search = ref("")

watch(search, () => {
    quizzes.value = q.filter((quiz) => {
        return quiz.name.toLowerCase().includes(search.value.toLowerCase())
    })
})

const beforeEnter = (el) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(-60px)";
}

const enter = (el) => {
    gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.3,
        delay: el.dataset.index * 0.3
    })
}

</script>

<template>
    <div>
        <header>
            <h1>Quizzes</h1>
            <input v-model.trim="search" type="text" placeholder="Search...">
        </header>
        <div class="cards-container">
            <TransitionGroup v-if="quizzes" appear @before-enter="beforeEnter" @enter="enter">
                <Card v-for="(quiz, index) in quizzes" :key="quiz.id" :quiz="quiz" :data-index="index" />
            </TransitionGroup>
            <div v-else class="spin-container">
                <p class="desc">Loading...</p>
                <!-- <n-spin size="medium" class="spin" >
                    <p class="desc">Loading...</p>
                </n-spin> -->
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
.container {
    max-width: 1000px;
    margin: 0 auto;
}

header {
    margin-bottom: 10px;
    margin-top: 30px;
    display: flex;
    align-items: center;

    h1 {
        font-weight: bold;
        margin-right: 30px;
    }

    input {
        border: none;
        background-color: rgba(128, 128, 128, 0.1);
        padding: 10px;
        border-radius: 5px;
    }
}

.cards-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 40px;
}


.spin-container {
    width: 700px;
    height: 500px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .spin {
        background-color: aqua;
    }

    .desc {
        font-size: 40px;
    }
}


// NOTE: 基础的进场动画
/* .card-enter-from {
    opacity: 0;
    transform: translateY(-50px);
}
.card-enter-to {
    opacity: 1;
    transform: translateY(0);
}
.card-enter-active {
    transition: all 0.5s ease;
} */
</style>