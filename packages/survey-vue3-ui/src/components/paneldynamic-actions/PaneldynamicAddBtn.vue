<template>
  <button
    type="button"
    :id="question.addButtonId"
    v-if="question.canAddPanel"
    :class="question.getAddButtonCss()"
    @click="addPanelClick"
  >
    <span :class="question.cssClasses.buttonAddText"
      ><SvComponent :is="'survey-string'" :locString="question.locAddPanelText"
    /></span>
  </button>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { type IPanelDynamicActionProps, usePanelDynamicAction } from "./action";

const props = defineProps<IPanelDynamicActionProps>();
const question = usePanelDynamicAction(props);
const addPanelClick = () => {
  question.value.addPanelUI();
};
</script>
