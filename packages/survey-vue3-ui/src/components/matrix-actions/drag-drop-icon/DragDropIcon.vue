<template>
  <div @pointerdown="question.onPointerDown($event, row)">
    <svg
      v-if="question.iconDragElement"
      :class="question.cssClasses.dragElementDecorator"
    >
      <use :xlink:href="question.iconDragElement"></use>
    </svg>
    <span v-else :class="question.cssClasses.iconDrag"></span>
  </div>
</template>

<script lang="ts" setup>
import type { Action } from "survey-core";
import { useMatrixAction } from "../matrix-action";
const props = defineProps<{ item: Action }>();
const { question, row } = useMatrixAction(props, true);
</script>
