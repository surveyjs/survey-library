<template>
  <input
    :disabled="question.isReadOnly"
    :class="question.cssClasses.root"
    :type="question.inputType"
    :maxlength="question.getMaxLength()"
    :min="question.min"
    :max="question.max"
    :step="question.step"
    :size="question.size"
    :id="question.inputId"
    :placeholder="
      question.inputType === 'range' || question.isReadOnly
        ? ''
        : question.placeHolder
    "
    :value="question.value"
    @change="change"
    @keyup="keyup"
    v-bind:aria-required="question.isRequired"
    v-bind:aria-label="question.locTitle.renderedHtml"
    :aria-invalid="question.errors.length > 0"
    :aria-describedby="question.errors.length > 0 ? question.id + '_errors' : null"  
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionTextModel } from "../question_text";

@Component
export class Text extends QuestionVue<QuestionTextModel> {
  change(event: any) {
    this.question.value = event.target.value;
  }
  keyup(event: any) {
    if (!this.question.isInputTextUpdate) return;
    this.question.value = event.target.value;
  }
}
Vue.component("survey-text", Text);
export default Text;
</script>
