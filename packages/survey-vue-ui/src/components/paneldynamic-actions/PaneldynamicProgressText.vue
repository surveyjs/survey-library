<template>
  <div :class="question.cssClasses.progressText">
    {{ question.progressText }}
  </div>
</template>

<script lang="ts" setup>
import { type IPanelDynamicActionProps, usePanelDynamicAction } from "./action";

const props = defineProps<IPanelDynamicActionProps>();
const question = usePanelDynamicAction(props);
</script>
