<template>
<div v-if="!question.isReadOnlyRenderDiv()">
  <sv-text-area :model="question.textAreaModel"></sv-text-area>
  <sv-character-counter v-if="question.getMaxLength()"
  :counter="question.characterCounter"
  :remainingCharacterCounter="question.cssClasses.remainingCharacterCounter">
  </sv-character-counter>
</div>
<div v-else>{{ question.value }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionCommentModel } from "survey-core";

@Component
export class Comment extends QuestionVue<QuestionCommentModel> {
}
Vue.component("survey-comment", Comment);

export default Comment;
</script>
