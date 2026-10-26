<template>
  <div :class="row.getRowCss()" ref="root">
    <SvComponent
      :is="'survey-element'"
      :row="row"
      :css="css"
      :element="element"
      v-for="element in row.visibleElements"
      :key="(element as any).id"
    ></SvComponent>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionRowModel, SurveyModel } from "survey-core";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { isBaseElementSubsribed, useBase } from "./base";

const props = defineProps<{
  row: QuestionRowModel;
  css?: any;
  survey: SurveyModel;
}>();
const root = ref<HTMLElement>();
let lazyRenderingTimeout: ReturnType<typeof setTimeout> | undefined = undefined;
useBase(
  () => props.row,
  (newValue, oldValue) => {
    newValue.setRootElement(root.value);
    if (oldValue) {
      newValue.isNeedRender = oldValue.isNeedRender;
    }
  },
  (value) => {
    if (!isBaseElementSubsribed(value)) {
      value.setRootElement(undefined);
      value.stopLazyRendering();
      value.isNeedRender = !value.isLazyRendering();
    }
  }
);
onMounted(() => {
  if (props.row) {
    props.row.setRootElement(root.value);
    if (!props.row.isNeedRender) {
      const rowContainerDiv = root.value;
      lazyRenderingTimeout = setTimeout(() => {
        lazyRenderingTimeout = undefined;
        props.row.startLazyRendering(rowContainerDiv as HTMLElement);
      }, 10);
    }
  }
});
// The timer belongs to this component instance: clear it on unmount even if another component
// still subscribes to the row. Not in the useBase clean callback, which also runs on a row swap,
// where the timer must start the new row.
onBeforeUnmount(() => {
  clearTimeout(lazyRenderingTimeout);
  lazyRenderingTimeout = undefined;
});
</script>
