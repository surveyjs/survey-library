<template>
  <div
    :title="question.panelPrevText"
    @click="prevPanelClick"
    :class="question.getPrevButtonCss()"
  >
    <SvComponent
      :is="'sv-svg-icon'"
      :iconName="question.cssClasses.progressBtnIcon"
      :size="'auto'"
    ></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { type IPanelDynamicActionProps, usePanelDynamicAction } from "./action";

const props = defineProps<IPanelDynamicActionProps>();
const question = usePanelDynamicAction(props);
const prevPanelClick = () => {
  question.value.goToPrevPanel();
};
</script>
