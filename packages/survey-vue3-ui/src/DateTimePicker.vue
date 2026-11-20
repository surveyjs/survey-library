<template>
  <div :class="question.getRootClass()" ref="root">
    <template v-for="(field, index) in fields" :key="field.id">
      <span v-if="index === 1" :class="question.cssClasses.rangeSeparator">{{ question.rangeSeparatorText }}</span>
      <div :class="question.getFieldClass()">
        <input
          :id="field.id"
          type="text"
          autocomplete="off"
          :class="question.getControlClass()"
          :placeholder="field.placeholder"
          :disabled="question.isDisabledAttr"
          :readonly="question.isReadOnlyAttr"
          ref="inputs"
          @blur="question.onBlur"
          @focus="question.onFocus"
          @keyup="question.onKeyUp"
          :aria-required="question.a11y_input_ariaRequired"
          :aria-label="question.a11y_input_ariaLabel"
          :aria-labelledby="question.a11y_input_ariaLabelledBy"
          :aria-describedby="question.a11y_input_ariaDescribedBy"
          :aria-invalid="question.a11y_input_ariaInvalid"
          :aria-errormessage="question.a11y_input_ariaErrormessage"
        />
        <SvComponent :is="'sv-action-bar'" :model="question.getEditorButtons(index)"></SvComponent>
      </div>
    </template>
    <SvComponent v-if="!question.isInputReadOnly" :is="'sv-popup'" :model="question.popupModel"></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import type { QuestionDateTimePickerModel } from "survey-core";
import SvComponent from "@/SvComponent.vue";
import { useQuestion } from "./base";
import { computed, nextTick, onMounted, onUpdated, ref, watch } from "vue";

const props = defineProps<{ question: QuestionDateTimePickerModel }>();
const root = ref<HTMLElement | null>(null);
const inputs = ref<Array<HTMLInputElement>>([]);
useQuestion(props, root);

const fields = computed(() => {
  const question = props.question;
  if (!question.range) {
    return [{ id: question.inputId, placeholder: question.renderedPlaceholder }];
  }
  return [
    { id: question.startInputId, placeholder: question.renderedStartPlaceholder },
    { id: question.endInputId, placeholder: question.renderedEndPlaceholder }
  ];
});

function renderedTexts(): Array<string> {
  const question = props.question;
  return question.range ? [question.renderedStartInputValue, question.renderedEndInputValue] : [question.renderedInputValue];
}
function syncInputs(): void {
  renderedTexts().forEach((text, index) => {
    const input = inputs.value[index];
    if (!input) return;
    const isFocused = input.ownerDocument.activeElement === input;
    if (!isFocused && input.value !== text) {
      input.value = text;
    }
  });
}
onMounted(syncInputs);
onUpdated(syncInputs);
// The template does not read the drafts, so a calendar click has to sync the inputs on its own.
watch(() => renderedTexts().join("\0"), syncInputs);
watch(() => props.question.range, async () => {
  await nextTick();
  if (!root.value) return;
  props.question.beforeDestroyQuestionElement(root.value);
  props.question.afterRenderQuestionElement(root.value);
  syncInputs();
});
</script>
