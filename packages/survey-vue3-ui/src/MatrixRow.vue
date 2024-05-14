<template>
  <tr
    :data-sv-drop-target-matrix-row="row.row && row.row.id"
    @pointerdown="question.onPointerDown($event, row.row)"
    :class="row.className"
    v-if="row.visible"
    ref="root"
  >
    <survey-matrixdropdown-cell
      :cell="cell"
      :question="question"
      v-for="(cell, cellIndex) in row.cells"
      :key="row.id + '_' + cellIndex"
    />
  </tr>
</template>
<script lang="ts" setup>
import type {
  QuestionMatrixDropdownRenderedRow,
  QuestionMatrixDropdownModel,
} from "survey-core";
import { useBase } from "./base";
import { watch, onMounted, onUnmounted, ref } from "vue";
const props = defineProps<{
  question: QuestionMatrixDropdownModel;
  row: QuestionMatrixDropdownRenderedRow;
}>();
const root = ref<HTMLElement>();

useBase(() => props.row);

const stopWatch = watch(
  () => props.row,
  (newValue, oldValue) => {
    if (oldValue) {
      oldValue.setRootElement(undefined as any);
    }
    newValue.setRootElement(root.value as any);
  }
);

onMounted(() => {
  props.row.setRootElement(root.value as any);
});
onUnmounted(() => {
  props.row.setRootElement(undefined as any);
  stopWatch();
});
</script>
