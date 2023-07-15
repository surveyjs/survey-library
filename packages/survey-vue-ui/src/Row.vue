<template>
  <div :class="row.getRowCss()" ref="root">
    <div v-for="element in elements" :style="element.rootStyle">
      <survey-element
        v-if="!element.isPanel"
        :key="element.id"
        :element="element"
        :survey="survey"
        :css="css"
        :row="row"
        :style="element.getRootStyle()"
      >
      </survey-element>
      <survey-panel
        v-if="element.isPanel"
        :key="element.id"
        :question="element"
        :css="css"
      >
      </survey-panel>
    </div>
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
