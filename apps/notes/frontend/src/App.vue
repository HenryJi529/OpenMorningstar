<script setup>
import { ref } from "vue"


const showModal = ref(false)
const newNote = ref("")
const errorMessage = ref("");
const notes = ref(localStorage.getItem("notes") !== null ? JSON.parse(localStorage.getItem("notes")) : [])

function getRandomColor() {
  return "hsl(" + Math.random() * 360 + ", 100%, 75%)";
}

const addNote = () => {
  if (newNote.value.trim().length < 10) {
    errorMessage.value = "Note is too short"
    return;
  }

  notes.value.push({
    id: Math.floor(Math.random() * 1000000),
    text: newNote.value,
    date: new Date().toLocaleString('en-US'),
    backgroundColor: getRandomColor()
  })

  showModal.value = false
  newNote.value = ""
  errorMessage.value = ""
  localStorage.setItem('notes', JSON.stringify(notes.value))
}

const deleteNote = (note) => {
  const index = notes.value.indexOf(note);
  if (index !== -1) {
    notes.value.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes.value));
  }
}

</script>

<template>
  <main>
    <div v-if="showModal" class="overlay">
      <div class="modal">
        <textarea v-model="newNote" name="note" id="note" cols="30" rows="10"></textarea>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <button @click="addNote()">Add Note</button>
        <button class="close" @click="showModal = false">Close</button>
      </div>
    </div>
    <div class="container">
      <header>
        <h1>Notes</h1>
        <button @click="showModal = true">+</button>
      </header>
      <div class="cards-container">
        <div v-for="note in  notes " class="card" :key="note.id"
          :style="{ backgroundColor: note.backgroundColor, position: 'relative' }">
          <font-awesome-icon icon="fa-solid fa-trash" class="delete-icon" @click="deleteNote(note)" />
          <p class="main-text">{{ note.text }}</p>
          <p class="date">{{ note.date }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  width: 100vw;
}

.container {
  max-width: 1000px;
  padding: 10px;
  margin: 0 auto;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  font-weight: bold;
  margin-bottom: 25px;
  font-size: 65px;
}

header button {
  border: none;
  padding: 10px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  background-color: rgb(21, 20, 20);
  border-radius: 50%;
  color: white;
  font-size: 20px;
}


.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  width: 225px;
  height: 225px;
  background-color: rgb(237, 182, 44);
  padding: 10px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.delete-icon {
  position: absolute;
  right: 15px;
  top: 15px;
}

.date {
  font-size: 12.5px;
  font-weight: bold;
}

.overlay {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(21, 20, 20, 0.77);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  width: 750px;
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal button {
  padding: 10px 20px;
  width: 100%;
  font-size: 20px;
  background-color: blueviolet;
  border: none;
  color: white;
  cursor: pointer;
  margin-top: 15px;
}

.modal .close {
  background-color: red;
  margin-top: 7px;
}

.modal p {
  color: red;
}
</style>