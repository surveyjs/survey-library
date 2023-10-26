<template>
  <div :style="getRootStyle(element)">
    <component :is="componentName" v-bind="componentData" />
  </div>
</template>
<script lang="ts" setup>
import type { QuestionRowModel, SurveyElement, SurveyModel } from "survey-core";
import { computed } from "vue";

const props = defineProps<{
  element: SurveyElement;
  row: QuestionRowModel;
  css?: any;
}>();

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
</script>
