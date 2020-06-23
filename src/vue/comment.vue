<template>
  <div>
    <textarea
      v-if="!question.isReadOnlyRenderDiv()"
      type="text"
      :readonly="question.isReadOnly"
      :disabled="question.isReadOnly"
      :value="question.value"
      :id="question.inputId"
      :maxlength="question.getMaxLength()"
      :cols="question.cols"
      v-bind:aria-label="question.locTitle.renderedHtml"
      :rows="question.rows"
      :placeholder="question.isReadOnly ? '' : question.placeHolder"
      :class="question.cssClasses ? question.cssClasses.root : 'panel-comment-root'"
      @change="change"
      @keyup="keyup"
      v-bind:aria-required="question.isRequired"
      :aria-invalid="question.errors.length > 0"
      :aria-describedby="question.errors.length > 0 ? question.id + '_errors' : null"  
    ></textarea>
    <div>
  <div v-if="question.isReadOnlyRenderDiv()">{{question.value}}</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionCommentModel } from "../question_comment";

@Component
export class Comment extends QuestionVue<QuestionCommentModel> {
  change(event: any) {
    this.question.value = event.target.value;
  }
  keyup(event: any) {
    if (!this.question.isInputTextUpdate) return;
    this.question.value = event.target.value;
  }
}
Vue.component("survey-comment", Comment);

export default Comment;
</script>
