<template>
  <div>
    <textarea
      v-if="!question.isReadOnlyRenderDiv()"
      type="text"
      :readonly="question.isInputReadOnly"
      :disabled="question.isInputReadOnly"
      :value="question.value"
      :id="question.inputId"
      :maxlength="question.getMaxLength()"
      :cols="question.cols"
      v-bind:aria-label="question.locTitle.renderedHtml"
      :rows="question.rows"
      :placeholder="question.renderedPlaceHolder"
      :class="question.cssClasses ? question.cssClasses.root : 'panel-comment-root'"
      @change="change"
      @input="onInput"
      v-bind:aria-required="question.isRequired"
      :aria-invalid="question.errors.length > 0"
      :aria-describedby="question.errors.length > 0 ? question.id + '_errors' : null"
      v-bind:style="{ resize: question.autoGrow ? 'none' : 'both'}"
    ></textarea>
    <div v-if="question.isReadOnlyRenderDiv()">{{ question.value }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionCommentModel, increaseHeightByContent } from "survey-core";

@Component
export class Comment extends QuestionVue<QuestionCommentModel> {
  change(event: any) {
    this.question.value = event.target.value;
  }
  onInput(event: any) {
    if (this.question.isInputTextUpdate) this.question.value = event.target.value;
    if (this.question.autoGrow) increaseHeightByContent(event.target);
  }
}
Vue.component("survey-comment", Comment);

export default Comment;
</script>
