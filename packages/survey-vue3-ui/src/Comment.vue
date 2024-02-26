<template>
  <textarea
    ref="root"
    v-if="!question.isReadOnlyRenderDiv() && !question.getMaxLength()"
    :readonly="question.isInputReadOnly"
    :disabled="question.isInputReadOnly"
    :value="question.value"
    :id="question.inputId"
    :maxlength="question.getMaxLength()"
    :cols="question.cols"
    :rows="question.rows"
    :placeholder="question.renderedPlaceholder"
    :class="question.className"
    @change="change"
    @input="
      (e) => {
        question.onInput(e);
      }
    "
    @keydown="
      (e) => {
        question.onKeyDown(e);
      }
    "
    :aria-required="question.a11y_input_ariaRequired"
    :aria-label="question.a11y_input_ariaLabel"
    :aria-labelledby="question.a11y_input_ariaLabelledBy"
    :aria-describedby="question.a11y_input_ariaDescribedBy"
    :aria-invalid="question.a11y_input_ariaInvalid"
    :aria-errormessage="question.a11y_input_ariaErrormessage"
    v-bind:style="{ resize: question.resizeStyle }"
  ></textarea>
  <div
    ref="root"
    v-else-if="!question.isReadOnlyRenderDiv() && question.getMaxLength()"
  >
    <textarea
      :readonly="question.isInputReadOnly"
      :disabled="question.isInputReadOnly"
      :value="question.value"
      :id="question.inputId"
      :maxlength="question.getMaxLength()"
      :cols="question.cols"
      :rows="question.rows"
      :placeholder="question.renderedPlaceholder"
      :class="question.className"
      @change="change"
      @input="
        (e) => {
          question.onInput(e);
        }
      "
      @keydown="
        (e) => {
          question.onKeyDown(e);
        }
      "
      :aria-required="question.a11y_input_ariaRequired"
      :aria-label="question.a11y_input_ariaLabel"
      :aria-labelledby="question.a11y_input_ariaLabelledBy"
      :aria-describedby="question.a11y_input_ariaDescribedBy"
      :aria-invalid="question.a11y_input_ariaInvalid"
      :aria-errormessage="question.a11y_input_ariaErrormessage"
      v-bind:style="{ resize: question.resizeStyle }"
    ></textarea>
    <sv-character-counter
      :counter="question.characterCounter"
      :remainingCharacterCounter="question.cssClasses.remainingCharacterCounter"
    ></sv-character-counter>
  </div>
  <div ref="root" v-else>{{ question.value }}</div>
</template>

<script lang="ts" setup>
import type { QuestionCommentModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{
  question: QuestionCommentModel;
  css?: object;
}>();
const root = ref(null);
useQuestion(props, root);
const change = (event: any) => {
  const question = props.question;
  question.value = event.target.value;
};
</script>
