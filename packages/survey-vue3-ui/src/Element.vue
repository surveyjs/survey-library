<template>
  <div
    ref="root"
    :style="getRootStyle(element)"
    :class="element.cssClasses.questionWrapper"
  >
    <component
      :is="componentName"
      v-bind="componentData"
      v-if="row.isNeedRender"
    />
    <component
      v-else-if="!!element.skeletonComponentName"
      :is="element.skeletonComponentName"
      :element="element"
      :css="css"
    ></component>
  </div>
</template>
<script lang="ts" setup>
import type { QuestionRowModel, SurveyElement, SurveyModel } from "survey-core";
import { computed, onMounted, watch, ref, onUnmounted } from "vue";

const props = defineProps<{
  element: SurveyElement;
  row: QuestionRowModel;
  css?: any;
}>();

const root = ref<HTMLElement>();

const getElementComponentName = (element: SurveyElement) => {
  return element.isPanel ? "survey-panel" : "survey-question";
};
const componentName = computed(() => {
  const survey = props.element.survey as SurveyModel;
  if (survey) {
    const name = survey.getElementWrapperComponentName(props.element as any);
    if (name) {
      return name;
    }
  }
  return getElementComponentName(props.element);
});
const getRootStyle: (element: SurveyElement) => any = (
  element: SurveyElement
) => {
  if (element.cssClasses) {
    return element.rootStyle;
  } else {
    return {};
  }
};
const componentData = computed(() => {
  const element = props.element;
  const survey = element.survey as SurveyModel;
  let data: any;
  if (survey) {
    data = survey.getElementWrapperComponentData(element as any);
  }
  return {
    componentName: getElementComponentName(element),
    componentData: {
      element: element,
      survey: survey,
      row: props.row,
      css: props.css,
      data: data,
    },
  };
});

const stopWatch = watch(
  () => props.element,
  (newValue, oldValue) => {
    if (oldValue) {
      oldValue.setWrapperElement(undefined);
    }
    newValue.setWrapperElement(root.value);
  }
);

onMounted(() => {
  props.element.setWrapperElement(root.value);
});
onUnmounted(() => {
  props.element.setWrapperElement(undefined);
  stopWatch();
});
</script>
