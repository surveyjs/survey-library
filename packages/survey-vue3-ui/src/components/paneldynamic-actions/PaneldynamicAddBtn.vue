<template>
  <button
    type="button"
    v-if="question.canAddPanel"
    :class="question.getAddButtonCss()"
    @click="addPanelClick"
  >
    <span :class="question.cssClasses.buttonAddText"
      ><survey-string :locString="question.locPanelAddText"
    /></span>
  </button>
</template>

<script lang="ts" setup>
import { type IPanelDynamicActionProps, usePanelDynamicAction } from "./action";

const props = defineProps<IPanelDynamicActionProps>();
const question = usePanelDynamicAction(props);
const addPanelClick = () => {
  question.value.addPanelUI();
};
</script>
