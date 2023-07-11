<template>
   <div v-if="question.isReadOnlyRenderDiv()">{{ question.comment }}</div>
    <textarea v-else
      :id="question.commentId"
      :readonly="question.isInputReadOnly"
      :disabled="question.isInputReadOnly"
      :class="question.cssClasses.other || commentClass"
      :value="question.comment"
      :maxlength="question.getOthersMaxLength()"
      :placeholder="question.commentPlaceholder"
      :aria-label="question.ariaLabel"
      :aria-required="question.ariaRequired"
      v-bind:style="{ resize: question.resizeStyle }"
      @change="(e) => { question.onCommentChange(e) }"
      @input="(e) => { question.onCommentInput(e) }"
    />
</template>

<script lang="ts">
import { Question } from "survey-core";
import { defineComponent, type PropType } from "vue";
import { QuestionVue } from "./base";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-question-comment",
  props: {
    question: { type: Object as PropType<Question>, required: true },
    commentClass: Object,
  },
  mixins: [QuestionVue],
});
</script>
