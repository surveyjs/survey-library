<template>
  <div :class="row.getRowCss()" ref="root">
    <div
      v-for="element in elements"
      :style="getRootStyle(element)"
      :key="element.id"
    >
      <component
        :is="getComponentName(element)"
        v-bind="getComponentData(element)"
      />
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

const getElementComponentName = (element: SurveyElement) => {
  return element.isPanel ? "survey-panel" : "survey-question";
};
const getComponentName = (element: SurveyElement) => {
  const survey = element.survey as SurveyModel;
  if (survey) {
    const name = survey.getElementWrapperComponentName(element as any);
    if (name) {
      return name;
    }
  }
  return getElementComponentName(element);
};
const getRootStyle: (element: SurveyElement) => any = (
  element: SurveyElement
) => {
  if (element.cssClasses) {
    return element.rootStyle;
  } else {
    return {};
  }
};
const getComponentData = (element: SurveyElement) => {
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
      css: element.isPanel ? props.css : element.getRootStyle(),
      data: data,
    },
  };
};

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
