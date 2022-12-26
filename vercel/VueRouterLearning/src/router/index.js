import { createRouter, createWebHistory } from "vue-router"

import AboutView from "../views/AboutView.vue"
import CarView from "../views/CarView.vue"
import ContactView from "../views/ContactView.vue"
import NotFoundView from "../views/404View.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: "home",
            component: () => import('../views/HomeView.vue')
        },
        { path: '/home', redirect: '/' },
        { path: '/about', component: AboutView },
        {
            path: "/cars/:id",
            name: "about",
            component: CarView,
            children: [
                {
                    path: "contact",
                    name: "contact",
                    component: ContactView
                }
            ]
        },
        {
            path: "/:catchall(.*)*",
            name: "404",
            component: NotFoundView
        }
    ]
})

export default router