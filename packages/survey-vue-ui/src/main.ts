import { createApp } from "vue";
import App from "./App.vue";
import Survey from "./index";

import "./assets/main.css";
import "survey-core/defaultV2.css";

const app = createApp(App);
app.use(Survey);

const mountedApp = app.mount("#app");
