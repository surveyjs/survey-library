<template>
  <div role="presentation" :class="question.getItemClass(item)" ref="root">
    <label :class="question.getLabelClass(item)">
      <input
        type="checkbox"
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
        :readonly="question.isReadOnlyAttr"
        :class="question.cssClasses.itemControl"
        :required="question.hasRequiredError()"
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
        <SvComponent :is="'survey-string'" :locString="item.locText" />
      </span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { ItemValue, QuestionCheckboxModel } from "survey-core";
import { ref } from "vue";
import { useSelectBaseItem } from "./selectbase-item";
const root = ref<HTMLElement>();

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  question: QuestionCheckboxModel;
  item: ItemValue;
  hideLabel?: boolean;
}>();

useSelectBaseItem(
  () => props.item,
  () => props.question,
  root
);

const change = (event: any) => {
  props.question.clickItemHandler(props.item, event.target.checked);
};
</script>
