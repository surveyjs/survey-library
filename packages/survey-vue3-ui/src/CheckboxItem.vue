<template>
  <div role="presentation">
    <label
      :class="question.getLabelClass(item)"
      :aria-label="question.getAriaItemLabel(item)"
    >
      <input
        v-if="item == question.selectAllItem"
        role="option"
        type="checkbox"
        :name="question.name"
        :value="isAllSelected"
        v-model="isAllSelected"
        :id="question.getItemId(item)"
        :disabled="!question.getItemEnabled(item)"
        :aria-describedby="question.ariaDescribedBy"
        :class="question.cssClasses.itemControl"
      /><input
        v-if="item != question.selectAllItem"
        role="option"
        type="checkbox"
        :name="question.name"
        :value="item.value"
        v-model="question.renderedValue"
        :id="question.getItemId(item)"
        :disabled="!question.getItemEnabled(item)"
        :aria-describedby="question.ariaDescribedBy"
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
      ><span v-if="!hideLabel" :class="question.cssClasses.controlLabel">
        <survey-string :locString="item.locText" />
      </span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import type { ItemValue, QuestionCheckboxModel } from "survey-core";
import { useBase } from "./base";
import { computed } from "vue";

const props = defineProps<{
  question: QuestionCheckboxModel;
  item: ItemValue;
  index: string | number;
  hideLabel?: boolean;
}>();
const isAllSelected = computed({
  get(): boolean | string {
    return props.question.isAllSelected || "";
  },
  set(val: boolean | string) {
    const question = props.question;
    question.isAllSelected = !!val;
  },
});

useBase(() => props.item);
</script>
