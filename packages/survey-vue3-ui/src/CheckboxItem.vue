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
            change(e);
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

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  question: QuestionCheckboxModel;
  item: ItemValue;
  hideLabel?: boolean;
}>();

useBase(() => props.item);

const change = (event: any) => {
  props.question.clickItemHandler(props.item, event.target.checked);
};
</script>
