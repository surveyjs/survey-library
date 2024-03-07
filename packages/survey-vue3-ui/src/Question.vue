<template>
  <div
    :class="element.getRootCss()"
    :style="getRootStyle()"
    ref="root"
    v-on:focusin="element.focusIn()"
    :id="element.id"
    :role="element.ariaRole"
    :aria-required="element.ariaRequired"
    :aria-invalid="element.ariaInvalid"
    :aria-labelledby="element.ariaLabelledBy"
    :aria-describedby="element.ariaDescribedBy"
    :aria-expanded="
      element.ariaExpanded === null
        ? undefined
        : element.ariaExpanded === 'true'
    "
    :data-name="element.name"
  >
    <survey-errors
      v-if="element.showErrorsAboveQuestion"
      :element="element"
      :location="'top'"
    />
    <survey-element-header
      v-if="element.hasTitleOnLeftTop"
      :element="element"
      :css="css"
    />
    <component :is="contentComponentName" v-bind="contentComponentData">
      <div
        :class="getContentClass(element) || undefined"
        v-show="element.renderedIsExpanded"
        role="presentation"
      >
        <survey-errors
          v-if="hasErrorsOnTop"
          :element="element"
          :location="'top'"
        />

        <component :is="componentName" :question="element" />
        <div v-if="element.hasComment" :class="element.getCommentAreaCss()">
          <div>
            <survey-string :locString="element.locCommentText" />
          </div>
          <survey-question-comment :question="element" />
        </div>
        <survey-errors
          v-if="hasErrorsOnBottom"
          :element="element"
          :location="'bottom'"
        />
        <div
          v-if="element.hasDescriptionUnderInput"
          :class="element.cssClasses.descriptionUnderInput"
          :id="element.ariaDescriptionId"
        >
          <survey-string :locString="element.locDescription" />
        </div>
      </div>
    </component>
    <survey-element-header
      v-if="element.hasTitleOnBottom"
      :element="element"
      :css="css"
    />
    <survey-errors
      v-if="element.showErrorsBelowQuestion"
      :element="element"
      :location="'bottom'"
    />
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import type { SurveyModel, Question } from "survey-core";
import { useBase } from "./base";
import { computed, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  survey: SurveyModel;
  element: Question;
  css?: any;
}>();
const root = ref<HTMLElement>(null as any);
const hasErrorsOnTop = computed(() => {
  return props.element.showErrorOnTop;
});
const hasErrorsOnBottom = computed(() => {
  return props.element.showErrorOnBottom;
});

const getContentClass = (element: Question) => {
  return element.cssContent;
};
const getRootStyle: () => any = () => props.element.getRootStyle();

useBase(() => props.element);

const afterRender = () => {
  if (root.value) {
    props.element.afterRender(root.value as HTMLElement);
  }
};
const stopWatch = watch(
  () => root.value,
  () => {
    afterRender();
  }
);
const componentName = computed(() => {
  if (props.element.customWidget) return "survey-customwidget";
  if (props.element.isDefaultRendering()) {
    return "survey-" + props.element.getTemplate();
  }
  return props.element.getComponentName();
});
const contentComponentName = computed(() => {
  return (
    props.element.survey as SurveyModel
  ).getQuestionContentWrapperComponentName(props.element);
});
const contentComponentData = computed(() => {
  return {
    componentData: {
      question: props.element,
      data: (
        props.element.survey as SurveyModel
      ).getElementWrapperComponentData(props.element),
    },
  };
});

onUnmounted(() => {
  stopWatch();
});
</script>
