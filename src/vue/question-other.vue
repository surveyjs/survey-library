<template>
  <div :class="question.getCommentAreaCss(true)">
    <div v-if="question.isReadOnlyRenderDiv()">{{ question.otherValue }}</div>
    <sv-text-area v-else :model="question.otherTextAreaModel"></sv-text-area>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question } from "survey-core";

@Component
export class OtherChoice extends Vue {
  @Prop() question: Question;
}
Vue.component("survey-other-choice", OtherChoice);
export default OtherChoice;
</script>
