<template>
  <div class="form-group">
    <textarea
      v-if="!question.isReadOnlyRenderDiv()"
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
    /><div v-if="question.isReadOnlyRenderDiv()">{{ question.comment }}</div>
  </div>
</template>

<script lang="ts">
import { Question } from "survey-core";
import { ref, defineComponent, type ComponentOptions, unref } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-question-comment",
  props: {
    question: Question,
    commentClass: Object,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.question; },
    }
  }
});

</script>
