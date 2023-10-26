<template>
  <div :class="row.getRowCss()" ref="root">
    <survey-element
      :row="row"
      :css="css"
      :element="element"
      v-for="element in elements"
      :key="element.id"
    ></survey-element>
  </div>
</template>

<script lang="ts" setup>
import type {
  PanelModel,
  Question,
  QuestionRowModel,
  SurveyElement,
  SurveyModel,
} from "survey-core";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useBase } from "./base";

const props = defineProps<{
  row: QuestionRowModel;
  css?: any;
  survey: SurveyModel;
}>();
const elements = computed(
  () => props.row.visibleElements as any as Array<Question | PanelModel>
);
const root = ref<HTMLElement>();

useBase(() => props.row);

onMounted(() => {
  if (props.row) {
    if (!props.row.isNeedRender) {
      const rowContainerDiv = root.value;
      setTimeout(() => {
        props.row.startLazyRendering(rowContainerDiv as HTMLElement);
      }, 10);
    }
  }
});
onUnmounted(() => {
  const row = props.row;
  if (row) {
    row.isNeedRender = !props.row.isLazyRendering();
  }
});
</script>
