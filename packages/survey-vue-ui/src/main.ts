import { createApp } from "vue";
import App from "./App.vue";
// import Survey from "./components/Survey.vue";
import Header from "./components/Header.vue";
import Page from "./components/Page.vue";
import Row from "./components/Row.vue";
import Element from "./components/Element.vue";
import Panel from "./components/Panel.vue";
import ElementHeader from "./components/ElementHeader.vue";
import String from "./components/String.vue";
import StringViewer from "./components/StringViewer.vue";
import Skeleton from "./components/components/Skeleton.vue";
import QuestionText from "./components/Text.vue";
import QuestionTextInput from "./components/TextInput.vue";

import TitleElement from "./components/components/title/TitleElement.vue";
import TitleContent from "./components/components/title/TitleContent.vue";
import TitleActions from "./components/components/title/TitleActions.vue";
import BrandInfo from "./components/components/BrandInfo.vue";

import "./assets/main.css";
import "survey-core/defaultV2.css";

const app = createApp(App);

// app.component("survey", Survey);
app.component("survey-header", Header);
app.component("survey-page", Page);
app.component("survey-row", Row);
app.component("survey-element", Element);
app.component("survey-panel", Panel);
app.component("survey-element-header", ElementHeader);
app.component("survey-string", String);
app.component("sv-string-viewer", StringViewer);
app.component("sv-skeleton", Skeleton);
app.component("survey-text", QuestionText);
app.component("survey-text-input", QuestionTextInput);

app.component("survey-element-title", TitleElement);
app.component("survey-element-title-content", TitleContent);
app.component("sv-title-actions", TitleActions);
app.component("sv-brand-info", BrandInfo);

const mountedApp = app.mount("#app");
