import { createRouter, createWebHistory } from 'vue-router'
import TestDefault from "../components/test/TestDefault.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/examples_test/default/vue3', component: TestDefault },
  ]
})

export default router
