import { createApp } from "vue";
import App from "./App.vue";
import { surveyPlugin } from "./index";

import "survey-core/defaultV2.css";

const app = createApp(App);
app.use(surveyPlugin);

const mountedApp = app.mount("#app");
