import {ref} from "vue"
import { defineStore } from 'pinia'

export const useLoadStore = defineStore('isLoading', {
  state: () => {
    return { isLoading: false }
  }
})