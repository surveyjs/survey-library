<template>
  <div role="presentation" :class="question.getItemClass(item)">
    <label @mousedown="question.onMouseDown()" :class="getLabelClass(item)">
      <input
        type="radio"
        :name="question.questionName"
        :value="item.value"
        :id="question.getItemId(item)"
        :aria-errormessage="question.ariaErrormessage"
        v-model="renderedValue"
        :disabled="!question.getItemEnabled(item)"
        :class="question.cssClasses.itemControl"
      /><span
        v-if="question.cssClasses.materialDecorator"
        :class="question.cssClasses.materialDecorator"
      >
        <svg
          v-if="question.itemSvgIcon"
          :class="question.cssClasses.itemDecorator"
        >
          <use :xlink:href="question.itemSvgIcon"></use>
        </svg> </span
      ><span v-if="!hideLabel" :class="getControlLabelClass(item)">
        <survey-string :locString="item.locText" />
      </span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import type { ItemValue, QuestionRadiogroupModel } from "survey-core";
import { useBase } from "./base";
import { computed } from "vue";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  question: QuestionRadiogroupModel;
  item: ItemValue;
  hideLabel?: boolean;
}>();
const getLabelClass = (item: any) => {
  return props.question.getLabelClass(item);
};
const getControlLabelClass = (item: any) => {
  return props.question.getControlLabelClass(item);
};

const renderedValue = computed({
  get: () => props.question.renderedValue,
  set: (val) => {
    const question = props.question;
    question.renderedValue = val;
  },
});

useBase(() => props.item);
</script>
