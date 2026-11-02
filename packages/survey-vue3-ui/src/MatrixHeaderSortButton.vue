<template>
  <button
    type="button"
    :class="cell.sortButtonCss"
    :aria-label="cell.sortAriaLabel"
    :title="cell.sortTooltip"
    :aria-describedby="!!cell.sortDescription ? cell.sortDescriptionId : undefined"
    :aria-disabled="!cell.canToggleSort ? 'true' : undefined"
    @click="onClick"
  >
    <span :class="cell.sortTitleCss"><slot></slot></span>
    <span :class="cell.sortCss" aria-hidden="true">
      <SvComponent :is="'sv-svg-icon'" :iconName="cell.sortIconName" :size="16"></SvComponent>
      <span v-if="!!cell.sortRank" :class="cell.sortRankCss">{{ cell.sortRank }}</span>
    </span>
    <span
      v-if="!!cell.sortDescription"
      :id="cell.sortDescriptionId"
      class="sv-visuallyhidden"
      >{{ cell.sortDescription }}</span
    >
  </button>
</template>

<script lang="ts" setup>
import type { QuestionMatrixDropdownModelBase, QuestionMatrixDropdownRenderedCell } from "survey-core";
import SvComponent from "@/SvComponent.vue";
import { useBase } from "./base";
const props = defineProps<{
  question: QuestionMatrixDropdownModelBase;
  cell: QuestionMatrixDropdownRenderedCell;
}>();
// The sort, the loading state and the page move live on the question.
useBase(() => props.question);
const onClick = (event: MouseEvent) => {
  props.cell.toggleSort(event.shiftKey || event.ctrlKey || event.metaKey);
};
</script>
