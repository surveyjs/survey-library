<template>
  <div
    :class="question.renderCssRoot"
    v-html="question.locHtml.renderedHtml"
  ></div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { QuestionHtmlModel } from "survey-core";

@Component
export class Html extends Vue {
  @Prop() question: QuestionHtmlModel;
  @Prop() css: any;
}
Vue.component("survey-html", Html);
export default Html;
</script>
