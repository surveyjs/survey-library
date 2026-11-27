<template>
  <div :class="question.cssClasses.row" v-if="row.isVisible">
    <div
      v-for="cell in row.cells"
      :key="cell.item.editor.id"
      :class="cell.className"
    >
      <SvComponent
        :is="'survey-multipletext-item'"
        :question="question"
        :cell="cell"
      ></SvComponent>
    </div>
  </div>
</template>
<script lang="ts" setup>
import SvComponent from './SvComponent.vue';
import type { MutlipleTextRow, QuestionMultipleTextModel } from 'survey-core';
import { useBase } from './base';
const props = defineProps<{ question: QuestionMultipleTextModel, row: MutlipleTextRow }>()
useBase(() => props.row);
</script>
