import { ComponentFactory }  from "survey-vue3-ui";

import { createApp } from 'vue'
import Action from "./components/test/test-custom-components/Action.vue"
import Item from "./components/test/test-custom-components/Item.vue"
import ItemContent from "./components/test/test-custom-components/ItemContent.vue"
import App from './App.vue'
import router from './router'

ComponentFactory.Instance.registerComponent("svc-custom-action", Action);
ComponentFactory.Instance.registerComponent("new-item", Item);
ComponentFactory.Instance.registerComponent("new-item-content", ItemContent);

const app = createApp(App)
app.use(router)

app.mount('#app')
