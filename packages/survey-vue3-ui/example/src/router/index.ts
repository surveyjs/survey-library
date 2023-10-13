import { createRouter, createWebHistory } from 'vue-router'
import TestDefault from "../components/test/TestDefault.vue";
import TestDefaultV2 from "../components/test/TestDefaultV2.vue";
import TestModern from "../components/test/TestModern.vue";
import TestBootstrap from "../components/test/TestBootstrap.vue";
import TestCustomWidget from "../components/test/TestCustomWidget.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/examples_test/default/vue3', component: TestDefault },
    { path: "/examples_test/defaultV2/vue3", component: TestDefaultV2 },
    { path: "/examples_test/modern/vue3", component: TestModern },
    { path: "/examples_test/bootstrap/vue3", component: TestBootstrap },
    { path: "/examples_test/customWidget/vue3", component: TestCustomWidget },
  ]
})

export default router
