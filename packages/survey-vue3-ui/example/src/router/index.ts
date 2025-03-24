import { createRouter, createWebHistory } from 'vue-router'
import TestDefault from "../components/test/TestDefault.vue";
import TestCustomWidget from "../components/test/TestCustomWidget.vue";
import Example from '../components/example/Example.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: Example },
    { path: "/examples_test/default/vue3", component: TestDefault },
    { path: "/examples_test/customWidget/vue3", component: TestCustomWidget },
  ]
})

export default router
