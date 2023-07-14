<template>
  <textarea
    v-if="!question.isReadOnlyRenderDiv() && !question.getMaxLength()"
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
    :aria-invalid="question.a11y_input_ariaInvalid"
    :aria-describedby="question.a11y_input_ariaDescribedBy"
    v-bind:style="{ resize: question.resizeStyle }"
  ></textarea>
  <div v-else-if="!question.isReadOnlyRenderDiv() && question.getMaxLength()">
    <textarea
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
      :aria-invalid="question.a11y_input_ariaInvalid"
      :aria-describedby="question.a11y_input_ariaDescribedBy"
      v-bind:style="{ resize: question.resizeStyle }"
    ></textarea>
    <sv-character-counter
      :counter="question.characterCounter"
      :remainingCharacterCounter="question.cssClasses.remainingCharacterCounter"
    ></sv-character-counter>
  </div>
  <div v-else>{{ question.value }}</div>
</template>

<script lang="ts">
import { QuestionCommentModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-comment",
  props: {
    question: {
      type: Object as PropType<QuestionCommentModel>,
      required: true,
    },
    css: Object,
  },
  mixins: [QuestionVue],
  methods: {
    change(event: any) {
      const question = this.question;
      question.value = event.target.value;
    },
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
  },
});
</script>
