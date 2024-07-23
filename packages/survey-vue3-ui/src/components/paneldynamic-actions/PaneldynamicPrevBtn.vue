<template>
  <div
    :title="question.panelPrevText"
    @click="prevPanelClick"
    :class="question.getPrevButtonCss()"
  >
    <SurveyVueComponent
      :name="'sv-svg-icon'"
      :iconName="question.cssClasses.progressBtnIcon"
      :size="'auto'"
    ></SurveyVueComponent>
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import { type IPanelDynamicActionProps, usePanelDynamicAction } from "./action";

const props = defineProps<IPanelDynamicActionProps>();
const question = usePanelDynamicAction(props);
const prevPanelClick = () => {
  question.value.goToPrevPanel();
};
</script>
