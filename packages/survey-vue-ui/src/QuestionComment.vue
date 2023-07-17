<template>
  <div v-if="question.isReadOnlyRenderDiv()">
    {{ question.comment }}
  </div>
  <textarea
    v-else
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
  commentClass?: any;
}>();
</script>
