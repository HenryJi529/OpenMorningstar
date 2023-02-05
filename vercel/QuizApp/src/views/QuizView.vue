<script setup>
import Question from '../components/Question.vue';
import QuizHeader from '../components/QuizHeader.vue';
import Result from '../components/Result.vue';
import q from '../data/quizzes.json';
import { useRoute } from 'vue-router';
import { ref, watch, computed } from 'vue';

const route = useRoute();
const quizId = route.params.id;
const quiz = q.find((quiz) => quiz.id === parseInt(quizId));
const currentQuestionIndex = ref(0);
const numberOfCorrectAnswers = ref(0);
// const questionStatus = ref(`${currentQuestionIndex.value}/${quiz.questions.length}`);
// watch(currentQuestionIndex, () => {
//     questionStatus.value = `${currentQuestionIndex.value}/${quiz.questions.length}`;
// })
const questionStatus = computed(() => {
    return `${currentQuestionIndex.value}/${quiz.questions.length}`;
})
const barPercentage = computed(() => `${currentQuestionIndex.value / quiz.questions.length * 100}%`)

const onOptionSelected = (isCorrect) => {
    if (isCorrect) {
        numberOfCorrectAnswers.value++;
    }
    currentQuestionIndex.value++;
}

</script>

<template>
    <div>
        <QuizHeader :questionStatus="questionStatus" :barPercentage="barPercentage" />
        <div>
            <Question v-if="currentQuestionIndex < quiz.questions.length"
                :question="quiz.questions[currentQuestionIndex]" @selectOption="onOptionSelected" />
            <Result v-else :results="`${numberOfCorrectAnswers}/${quiz.questions.length}`" />
        </div>
    </div>
</template>
