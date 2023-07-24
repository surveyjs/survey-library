<template>
  <div
    :title="question.panelNextText"
    @click="nextPanelClick"
    :class="question.getNextButtonCss()"
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
const nextPanelClick = () => {
  question.value.goToNextPanel();
};
</script>
