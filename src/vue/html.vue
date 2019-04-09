<template>
  <div :class="question.cssClasses.root" v-html="question.locHtml.renderedHtml"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { QuestionHtmlModel } from "../question_html";

@Component
export class Html extends Vue {
  @Prop question: QuestionHtmlModel;
  @Prop css: any;
}
Vue.component("survey-html", Html);
export default Html;
</script>
