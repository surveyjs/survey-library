<template>
  <div :class="row.getRowCss()" ref="root">
    <survey-element
      :row="row"
      :css="css"
      :element="element"
      v-for="element in row.visibleElements"
      :key="element.id"
    ></survey-element>
  </div>
</template>

<script lang="ts" setup>
import {
  AnimationCollection,
  type IElement,
  type QuestionRowModel,
  type SurveyElement,
  type SurveyModel,
} from "survey-core";
import {
  computed,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
  shallowRef,
  toRaw,
  triggerRef,
} from "vue";
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
