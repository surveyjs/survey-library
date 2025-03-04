import { createApp } from "vue";
import App from "./App.vue";
import { surveyPlugin } from "./index";

import "survey-core/survey-core.css";

const app = createApp(App);
app.use(surveyPlugin);

app.mount("#app");
