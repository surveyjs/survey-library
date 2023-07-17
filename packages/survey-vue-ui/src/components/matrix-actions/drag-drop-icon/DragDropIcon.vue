<template>
  <span :class="question.cssClasses.iconDrag"></span>
</template>

<script lang="ts" setup>
import type { Action } from "survey-core";
import { useMatrixAction } from "../matrix-action";
const props = defineProps<{ item: Action }>();
const { question } = useMatrixAction(props, false);
</script>
