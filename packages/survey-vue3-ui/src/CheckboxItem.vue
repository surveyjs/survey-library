<template>
  <div role="presentation" :class="question.getItemClass(item)">
    <label :class="question.getLabelClass(item)">
      <input
        type="checkbox"
        role="option"
        :name="question.name + item.id"
        :checked="question.isItemSelected(item)"
        @input="
          (e) => {
            question.clickItemHandler(item, e.target.checked);
          }
        "
        :value="item.value"
        :id="question.getItemId(item)"
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

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  question: QuestionCheckboxModel;
  item: ItemValue;
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

const renderedValue = computed({
  get: () => props.question.renderedValue,
  set: (val) => {
    const question = props.question;
    question.renderedValue = val;
  },
});

useBase(() => props.item);
</script>
