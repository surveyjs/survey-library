<template>
  <button
    type="button"
    :id="question.addButtonId"
    v-if="question.canAddPanel"
    :class="question.getAddButtonCss()"
    :disabled="!isActionEnabled"
    @click="addPanelClick"
  >
    <span :class="question.cssClasses.buttonAddText"
      ><SvComponent :is="'survey-string'" :locString="question.locAddPanelText"
    /></span>
  </button>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { type IPanelDynamicActionProps, usePanelDynamicAction, useIsActionEnabled } from "./action";

const props = defineProps<IPanelDynamicActionProps>();
const question = usePanelDynamicAction(props);
const isActionEnabled = useIsActionEnabled(props);
const addPanelClick = () => {
  if (!isActionEnabled.value) return;
  question.value.addPanelUI();
};
</script>
