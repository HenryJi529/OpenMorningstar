<script setup>
import { useRouter } from "vue-router"

const { quiz } = defineProps(['quiz'])

const router = useRouter()

const navigateToQuiz = () => {
    router.push(`/quiz/${quiz.id}`)
}
</script>


<template>
    <div class="card" @click="navigateToQuiz">
        <img :src="quiz.img" alt="">
        <div class="card-text">
            <h2>{{ quiz.name }}</h2>
            <p>{{ quiz.questions.length }} questions</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.card {
    width: 310px;
    overflow: hidden;
    border-radius: 2%;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 35px;
    margin-right: 20px;
    cursor: pointer;

    img {
        width: 100%;
        height: 200px;
        margin: 0;
    }

    .card-text {
        padding: 0 5px;

        h2 {
            font-weight: bold;
        }
    }
}
</style>