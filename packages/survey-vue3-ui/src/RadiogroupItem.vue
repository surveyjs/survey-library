<template>
  <div role="presentation" :class="question.getItemClass(item)" ref="root">
    <label @mousedown="question.onMouseDown()" :class="getLabelClass(item)">
      <input
        type="radio"
        :name="question.questionName"
        :value="item.value"
        :id="question.getItemId(item)"
        :aria-errormessage="question.ariaErrormessage"
        :checked="question.isItemSelected(item)"
        @input="
          (e) => {
            change();
          }
        "
        :disabled="!question.getItemEnabled(item)"
        :readonly="question.isReadOnlyAttr"
        :class="question.cssClasses.itemControl"
        :aria-label="ariaLabel"
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
  <SvComponent
    v-if="item.renderedIsPanelShowing"
    :is="'survey-panel'"
    :element="item.panel"
    :cssClasses="question.cssClasses"
  />
  <SvComponent
    :is="'survey-other-choice'"
    v-if="item.renderedIsCommentShowing"
    :question="question"
    :item="item"
  />
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { ChoiceItem, QuestionRadiogroupModel } from "survey-core";
import { ref } from "vue";
import { useSelectBaseItem } from "./selectbase-item";
const root = ref<HTMLElement>();
defineOptions({ inheritAttrs: false });

const props = defineProps<{
  question: QuestionRadiogroupModel;
  item: ChoiceItem;
  hideLabel?: boolean;
  ariaLabel?: string;
}>();
const getLabelClass = (item: any) => {
  return props.question.getLabelClass(item);
};
const getControlLabelClass = (item: any) => {
  return props.question.getControlLabelClass(item);
};

const change = () => {
  props.question.clickItemHandler(props.item);
};

useSelectBaseItem(
  () => props.item,
  () => props.question,
  root
);
</script>
