<template>
  <div :class="question.cssClasses.dragHandle" role="button" tabindex="0" :aria-label="item.ariaLabel"
    @pointerdown="question.onPointerDown($event, row)" @keydown="question.onDragHandleKeyDown($event, row)">
    <SvComponent v-if="question.iconDragElement" :is="'sv-svg-icon'" :size="item.iconSize" :iconName="item.iconName"
      :className="question.cssClasses.dragElementDecorator"></SvComponent>
    <span v-else :class="question.cssClasses.iconDrag"></span>
  </div>
</template>

<script lang="ts" setup>
import type { Action } from "survey-core";
import { useMatrixAction } from "../matrix-action";
import SvComponent from "@/SvComponent.vue";
const props = defineProps<{ item: Action }>();
const { question, row } = useMatrixAction(props, true);
</script>
