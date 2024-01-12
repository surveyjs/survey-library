<template>
  <button
    type="button"
    :class="question.getPanelRemoveButtonCss()"
    @click="removePanelClick(panel)"
  >
    <span :class="question.cssClasses.buttonRemoveText"
      ><survey-string :locString="question.locPanelRemoveText"
    /></span>
    <span :class="question.cssClasses.iconRemove"></span>
  </button>
</template>

<script lang="ts" setup>
import type { PanelModel } from "survey-core";
import { type IPanelDynamicActionProps, usePanelDynamicAction } from "./action";
import { computed } from "vue";

const props = defineProps<IPanelDynamicActionProps>();
const question = usePanelDynamicAction(props);
const panel = computed(
  () => (props.item && props.item.data.panel) || props.data.panel
);

const removePanelClick = (panel: PanelModel) => {
  if (!question.value.isInputReadOnly) {
    question.value.removePanelUI(panel);
  }
};
</script>
