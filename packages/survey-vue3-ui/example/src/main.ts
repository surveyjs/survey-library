import { surveyPlugin }  from "survey-vue3-ui";

import { createApp } from 'vue'
import Action from "./components/test/test-custom-components/Action.vue"
import Item from "./components/test/test-custom-components/Item.vue"
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(surveyPlugin);


app.component("svc-custom-action", Action);
app.component("new-item", Item);

app.use(router)

app.mount('#app')
