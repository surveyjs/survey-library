<template>
  <div v-if="question.isReadOnlyRenderDiv()">
    {{ question.comment }}
  </div>
  <textarea
    v-else
    :id="question.commentId"
    :readonly="question.isInputReadOnly"
    :disabled="question.isInputReadOnly"
    :class="question.cssClasses.other"
    :value="question.comment"
    :maxlength="question.getOthersMaxLength()"
    :placeholder="question.renderedCommentPlaceholder"
    :aria-label="question.ariaLabel || question.a11y_input_ariaLabel"
    :aria-required="question.ariaRequired || question.a11y_input_ariaRequired"
    v-bind:style="{ resize: question.resizeStyle }"
    @change="
      (e) => {
        question.onCommentChange(e);
      }
    "
    @input="
      (e) => {
        question.onCommentInput(e);
      }
    "
  />
</template>

<script lang="ts" setup>
import type { Question } from "survey-core";
defineProps<{
  question: Question;
}>();
</script>
