import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResultView from '../views/ResultView.vue'
import RedirectView from '../views/RedirectView.vue'
import NotFoundView from "../views/NotFoundView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/result',
      name: 'result',
      component: ResultView
    },
    {
      path: '/redirect/:id',
      name: 'redirect',
      component: RedirectView
    },
    {
      path: "/:catchall(.*)*",
      name: "404",
      component: NotFoundView
  }
  ]
})

export default router
