<script setup>
import q from '../assets/data/quizzes.json';
import { ref, watch } from 'vue'
import gsap from 'gsap'
import Card from '../components/Card.vue'

const quizzes = ref(q)
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
            <TransitionGroup appear @before-enter="beforeEnter" @enter="enter">
                <Card v-for="(quiz, index) in quizzes" :key="quiz.id" :quiz="quiz" :data-index="index" />
                <!-- <div class="card" v-for="quiz in quizzes" :key="quiz.id">
                    <img :src="quiz.img" alt="">
                    <div class="card-text">
                        <h2>{{ quiz.name }}</h2>
                        <p>{{ quiz.questions.length }} questions</p>
                    </div>
                </div> -->
            </TransitionGroup>
        </div>
    </div>
</template>


<style scoped>
.container {
    max-width: 1000px;
    margin: 0 auto;
}

header {
    margin-bottom: 10px;
    margin-top: 30px;
    display: flex;
    align-items: center;
}

header h1 {
    font-weight: bold;
    margin-right: 30px;
}

header input {
    border: none;
    background-color: rgba(128, 128, 128, 0.1);
    padding: 10px;
    border-radius: 5px;
}


.cards-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 40px;
}

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