<template>
  <div v-if="!question.isReadOnlyRenderDiv() && question.getMaxLength()">
    <sv-text-area :model="question.textAreaModel"></sv-text-area>
    <sv-character-counter
      :counter="question.characterCounter"
      :remainingCharacterCounter="question.cssClasses.remainingCharacterCounter"
    ></sv-character-counter>
  </div>
  <sv-text-area
    v-else-if="!question.isReadOnlyRenderDiv()"
    :model="question.textAreaModel"
  ></sv-text-area>
  <div v-else>{{ question.value }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionCommentModel } from "survey-core";

@Component
export class Comment extends QuestionVue<QuestionCommentModel> {}
Vue.component("survey-comment", Comment);

export default Comment;
</script>
