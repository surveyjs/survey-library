<template>
  <div role="presentation" :class="question.getRadioItemClass(question.cssClasses, value)">
    <label :class="question.cssClasses.radioLabel">
      <input
        type="radio"
        :name="question.name"
        :value="value"
        :checked="value === question.booleanValueRendered"
        :aria-describedby="question.ariaDescribedBy"
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

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { QuestionBooleanModel } from "survey-core";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-boolean-radio-item",
  props: {
    question: Object as PropType<QuestionBooleanModel>,
    locText: Object,
    value: Object,
  },
  data(vm: any) {
    return {
      handleChange: (event: any) => {
        vm.question.booleanValue = event.target.value == "true";
      }
    };
  },
});
</script>

