<template>
  <div
    :title="question.panelPrevText"
    @click="prevPanelClick"
    :class="question.getPrevButtonCss()"
  >
    <sv-svg-icon
      :iconName="question.cssClasses.progressBtnIcon"
      :size="'auto'"
    ></sv-svg-icon>
  </div>
</template>

<script lang="ts" setup>
import { type IPanelDynamicActionProps, usePanelDynamicAction } from "./action";

const props = defineProps<IPanelDynamicActionProps>();
const question = usePanelDynamicAction(props);
const prevPanelClick = () => {
  question.value.goToPrevPanel();
};
</script>
