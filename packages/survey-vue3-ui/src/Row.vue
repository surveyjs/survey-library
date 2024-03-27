<template>
  <div :class="row.getRowCss()" ref="root">
    <survey-element
      :row="row"
      :css="css"
      :element="element"
      v-for="element in row.visibleElements"
      :key="(element as any).id"
    ></survey-element>
  </div>
</template>

<script lang="ts" setup>
import type { QuestionRowModel, SurveyElement, SurveyModel } from "survey-core";
import { onMounted, ref } from "vue";
import { useBase } from "./base";

const props = defineProps<{
  row: QuestionRowModel;
  css?: any;
  survey: SurveyModel;
}>();
const root = ref<HTMLElement>();
useBase(
  () => props.row,
  (newValue, oldValue) => {
    newValue.setRootElement(root.value);
    if (oldValue) {
      newValue.isNeedRender = oldValue.isNeedRender;
    }
  },
  (value) => {
    value.setRootElement(undefined);
    value.stopLazyRendering();
    value.isNeedRender = !value.isLazyRendering();
  }
);

onMounted(() => {
  if (props.row) {
    props.row.setRootElement(root.value);
    if (!props.row.isNeedRender) {
      const rowContainerDiv = root.value;
      setTimeout(() => {
        props.row.startLazyRendering(rowContainerDiv as HTMLElement);
      }, 10);
    }
  }
});
</script>
