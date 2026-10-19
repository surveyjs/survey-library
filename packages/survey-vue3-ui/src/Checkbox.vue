<template>
  <SelectBase :question="question" :show-legend="true" :on-key-down="onKeyDown"></SelectBase>
</template>
<script lang="ts" setup>
import type { QuestionCheckboxModel } from "survey-core";
import SelectBase from "./SelectBase.vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionCheckboxModel }>();
const onKeyDown = (event: any) => {
  props.question.onKeyDown?.(event);
};
</script>
