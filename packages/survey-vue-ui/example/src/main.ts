import SurveyPlugin  from "survey-vue-ui";

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(SurveyPlugin);


app.use(router)

app.mount('#app')
