<template>
  <button
    type="button"
    :id="getId(panel)"
    :class="question.getPanelRemoveButtonCss()"
    @click="removePanelClick(panel)"
  >
    <span :class="question.cssClasses.buttonRemoveText"
      ><SvComponent
        :is="'survey-string'"
        :locString="question.locRemovePanelText"
    /></span>
    <span :class="question.cssClasses.iconRemove"></span>
  </button>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { PanelModel } from "survey-core";
import { type IPanelDynamicActionProps, usePanelDynamicAction } from "./action";
import { computed } from "vue";

const props = defineProps<IPanelDynamicActionProps>();
const question = usePanelDynamicAction(props);
const panel = computed(
  () => (props.item && props.item.data.panel) || props.data.panel
);

const getId = (panel: PanelModel): string => {
  return question.value.getPanelRemoveButtonId(panel);
};
const removePanelClick = (panel: PanelModel) => {
  if (!question.value.isInputReadOnly) {
    question.value.removePanelUI(panel);
  }
};
</script>
