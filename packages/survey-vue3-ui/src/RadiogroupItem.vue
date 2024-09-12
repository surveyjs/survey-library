<template>
  <div role="presentation" :class="question.getItemClass(item)" ref="root">
    <label @mousedown="question.onMouseDown()" :class="getLabelClass(item)">
      <input
        type="radio"
        :name="question.questionName"
        :value="item.value"
        :id="question.getItemId(item)"
        :aria-errormessage="question.ariaErrormessage"
        v-model="renderedValue"
        :disabled="!question.getItemEnabled(item)"
        :readonly="question.isReadOnlyAttr"
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
        <SvComponent :is="'survey-string'" :locString="item.locText" />
      </span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { ItemValue, QuestionRadiogroupModel } from "survey-core";
import { computed, ref } from "vue";
import { useSelectBaseItem } from "./selectbase-item";
const root = ref<HTMLElement>();
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

useSelectBaseItem(
  () => props.item,
  () => props.question,
  root
);
</script>
