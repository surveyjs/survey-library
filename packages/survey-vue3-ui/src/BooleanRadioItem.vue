<template>
  <div
    role="presentation"
    :class="question.getRadioItemClass(question.cssClasses, value)"
  >
    <label :class="question.cssClasses.radioLabel">
      <input
        type="radio"
        :name="question.name"
        :value="value"
        :checked="value === question.booleanValueRendered"
        :aria-errormessage="question.ariaErrormessage"
        :disabled="question.isInputReadOnly"
        :class="question.cssClasses.itemRadioControl"
        @change="handleChange"
      />
      <span
        v-if="question.cssClasses.materialRadioDecorator"
        :class="question.cssClasses.materialRadioDecorator"
      >
        <svg
          v-if="question.itemSvgIcon"
          :class="question.cssClasses.itemRadioDecorator"
        >
          <use :xlink:href="question.itemSvgIcon"></use>
        </svg>
      </span>
      <span :class="question.cssClasses.radioControlLabel">
        <survey-string :locString="locText" />
      </span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import type { LocalizableString, QuestionBooleanModel } from "survey-core";

const props = defineProps<{
  question: QuestionBooleanModel;
  locText: LocalizableString;
  value: boolean;
}>();
const handleChange = (event: any) => {
  const question = props.question;
  question.booleanValue = event.target.value == "true";
};
</script>
