<script setup>
const { question } = defineProps(['question'])
const emit = defineEmits(['selectOption'])

const emitSelectOption = (isCorrect) => {
    emit('selectOption', isCorrect)
}

</script>

<template>
    <div class="question-container">
        <Transition name="fade" appear>
            <h1 class="question">{{ question.text }}</h1>
        </Transition>
    </div>
    <div class="options-container">
        <div class="option" v-for="option in question.options" @click="emitSelectOption(option.isCorrect)">
            <p class="option-label">{{ option.label }}</p>
            <div class="option-value">
                <p>{{ option.text }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.question-container {
    margin-top: 20px;
}

.question {
    font-size: 40px;
    margin-bottom: 20px;
}

.flash {
    animation: flash 1s linear infinite;
}

@keyframes flash {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.option {
    display: flex;
    margin-bottom: 20px;
    cursor: pointer;
}

.option-label {
    width: 50px;
    height: 50px;
    font-size: 30px;
    background-color: bisque;
    display: flex;
    align-items: center;
    justify-content: center;
}

.option-value {
    background-color: rgb(244, 239, 239);
    width: 100%;
    font-size: 30px;
    padding: 0 20px;
}

.option-value p {
    height: 50px;
    line-height: 50px;
}

.fade-enter-from {
    opacity: 0;
}

.fade-enter-to {
    opacity: 1;
}

.fade-enter-active {
    transition: all 3s ease;
}
</style>