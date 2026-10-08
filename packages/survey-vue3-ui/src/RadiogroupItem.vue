<template>
  <div role="presentation" :class="question.getItemClass(item)" ref="root">
    <label @mousedown="question.onMouseDown()" :class="getLabelClass(item)">
      <span
        v-if="question.getChoiceKeyBadge(item)"
        :class="question.getItemShortcutKeyClass(item)"
        aria-hidden="true"
      >{{ question.getChoiceKeyBadge(item) }}</span>
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
        @keydown="question.onKeyDown?.($event)"
        @focusout="question.onChoiceFocusOut?.($event)"
        :disabled="!question.getItemEnabled(item)"
        :readonly="question.isReadOnlyAttr"
        :class="question.cssClasses.itemControl"
        :aria-label="ariaLabel"
        :aria-labelledby="!ariaLabel && !hideLabel ? question.getItemLabelId(item) : undefined"
        :aria-keyshortcuts="question.getItemAriaKeyShortcuts(item)"
      /><span
        v-if="question.cssClasses.materialDecorator"
        :class="question.cssClasses.materialDecorator"
        aria-hidden="true"
      >
        <svg
          v-if="question.itemSvgIcon"
          :class="question.cssClasses.itemDecorator"
        >
          <use :xlink:href="question.itemSvgIcon"></use>
        </svg> </span
      ><span
        v-if="!hideLabel"
        :class="getControlLabelClass(item)"
        :id="question.getItemLabelId(item)"
        :aria-hidden="question.isItemLabelAriaHidden ? 'true' : undefined"
      >
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
