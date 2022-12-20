<template>
  <div class="form-group">
    <textarea
      v-if="!question.isReadOnlyRenderDiv()"
      :readonly="question.isInputReadOnly"
      :disabled="question.isInputReadOnly"
      :class="question.cssClasses.other || commentClass"
      :value="question.comment"
      :maxlength="question.getOthersMaxLength()"
      :placeholder="question.commentOrOtherPlaceholder"
      :aria-label="question.ariaLabel"
      :aria-required="question.ariaRequired"
      v-bind:style="{ resize: question.resizeStyle }"
      @change="(e) => { question.onCommentChange(e) }"
      @input="(e) => { question.onCommentInput(e) }"
    /><div v-if="question.isReadOnlyRenderDiv()">{{ question.comment }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Question } from "survey-core";

@Component
export class QuestionComment extends Vue {
  @Prop() question: Question;
  @Prop() commentClass: any;
}
Vue.component("survey-question-comment", QuestionComment);
export default QuestionComment;
</script>
