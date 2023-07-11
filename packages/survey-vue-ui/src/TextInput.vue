<template>
  <input :disabled="question.isInputReadOnly"
  :class="question.getControlClass()"
  :type="question.inputType"
  :maxlength="question.getMaxLength()"
  :min="question.renderedMin"
  :max="question.renderedMax"
  :step="question.renderedStep"
  :size="question.renderedInputSize"
  :style="inputStyle"
  :id="question.inputId"
  :list="question.dataListId"
  :placeholder="question.renderedPlaceholder"
  :autocomplete="question.autocomplete"
  :value="question.value"
  @change="question.onChange"
  @keyup="question.onKeyUp"
  @keydown="question.onKeyDown"
  @composition-update="question.onCompositionUpdate"
  @blur="question.onBlur"
  :aria-required="question.a11y_input_ariaRequired"
  :aria-label="question.a11y_input_ariaLabel"
  :aria-labelledby="question.a11y_input_ariaLabelledBy"
  :aria-invalid="question.a11y_input_ariaInvalid"
  :aria-describedby="question.a11y_input_ariaDescribedBy"
/>
</template>

<script lang="ts">
import { QuestionTextModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-text-input",
  mixins: [QuestionVue],
  props: {
    question: { type: Object as PropType<QuestionTextModel>, required: true },
  },
  computed: {
    inputStyle(): any {
      return this.question.inputStyle;
    },
  },
});
</script>
