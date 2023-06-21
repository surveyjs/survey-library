<template>
    <textarea
      v-if="!question.isReadOnlyRenderDiv()"
      :readonly="question.isInputReadOnly"
      :disabled="question.renderedInputDisabled"
      :value="question.value"
      :id="question.inputId"
      :maxlength="question.getMaxLength()"
      :cols="question.cols"
      :rows="question.rows"
      :placeholder="question.renderedPlaceholder"
      :class="question.className"
      @change="change"
      @input="(e) => { question.onInput(e) }"
      @keydown="(e) => { question.onKeyDown(e) }"
      :aria-required="question.a11y_input_ariaRequired"
      :aria-label="question.a11y_input_ariaLabel"
      :aria-labelledby="question.a11y_input_ariaLabelledBy"
      :aria-invalid="question.a11y_input_ariaInvalid"
      :aria-describedby="question.a11y_input_ariaDescribedBy"
      v-bind:style="{ resize: question.resizeStyle }"
    ></textarea>
    <div v-else>{{ question.value }}</div>
</template>

<script lang="ts">
import { QuestionCommentModel } from "survey-core";
import { defineSurveyComponent } from "./base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey-comment",
  props: {
    question: QuestionCommentModel,
    css: Object,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.question; },
      change(event: any) {
        vm.question.value = event.target.value;
      }
    }
  },
  mounted() {
    if (this.question) {
      this.question.afterRenderQuestionElement(this.$el as HTMLElement);
    }
  },
  unmounted() {
    if (this.question) {
      this.question.beforeDestroyQuestionElement(this.$el as HTMLElement);
    }
  }
});

</script>
