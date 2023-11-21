<template>
  <SelectBase :question="question"></SelectBase>
</template>

<script lang="ts" setup>
import type { QuestionCheckboxModel } from "survey-core";
import SelectBase from "./SelectBase.vue";
defineOptions({
  inheritAttrs: false,
});
defineProps<{ question: QuestionCheckboxModel }>();
</script>
