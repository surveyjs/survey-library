import { createRouter, createWebHistory } from 'vue-router'
import TestDefaultV2 from "../components/test/TestDefaultV2.vue";
import TestCustomWidget from "../components/test/TestCustomWidget.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/examples_test/defaultV2/vue3", component: TestDefaultV2 },
    { path: "/examples_test/customWidget/vue3", component: TestCustomWidget },
  ]
})

export default router
