<template>
  <div class="form-group">
    <textarea
      :readonly="question.isReadOnly"
      :disabled="question.isReadOnly"
      :class="question.cssClasses.other || commentClass"
      :value="question.comment"
      :maxlength="question.getOthersMaxLength()"
      :placeholder="question.otherPlaceHolder"
      v-bind:aria-label="question.locTitle.renderedHtml"
      @change="change"
      @keyup="keyup"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question } from "../question";

@Component
export class OtherChoice extends Vue {
  @Prop question: Question;
  @Prop commentClass: any;
  change(event: any) {
    this.question.comment = event.target.value;
  }
  keyup(event: any) {
    if (!this.question.isSurveyInputTextUpdate) return;
    this.question.comment = event.target.value;
  }
}
Vue.component("survey-other-choice", OtherChoice);
export default OtherChoice;
</script>