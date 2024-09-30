<template>
  <div v-if="question.isReadOnlyRenderDiv()">{{ question.comment }}</div>
  <sv-text-area v-else :model="question.commentTextAreaModel"></sv-text-area>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question } from "survey-core";

@Component
export class OtherComment extends Vue {
  @Prop() question: Question;
}
Vue.component("survey-question-comment", OtherComment);
export default OtherComment;
</script>
