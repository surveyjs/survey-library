<template>
  <div role="presentation">
    <label
      @mousedown="question.onMouseDown()"
      :class="getLabelClass(item)"
      :aria-label="question.getAriaItemLabel(item)"
    >
      <input
        type="radio"
        :name="question.questionName"
        :value="item.value"
        :id="question.getItemId(item)"
        :aria-describedby="question.ariaDescribedBy"
        v-model="question.renderedValue"
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

const props = defineProps<{
  question: QuestionRadiogroupModel;
  item: ItemValue;
  index: string | number;
  hideLabel?: boolean;
}>();
const getLabelClass = (item: any) => {
  return props.question.getLabelClass(item);
};
const getControlLabelClass = (item: any) => {
  return props.question.getControlLabelClass(item);
};

useBase(() => props.item);
</script>
