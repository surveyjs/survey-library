<template>
  <div
    :class="element.getRootCss()"
    :style="getRootStyle()"
    ref="root"
    v-if="row.isNeedRender"
    v-on:focusin="element.focusIn()"
    :id="element.id"
    :role="element.ariaRole"
    :aria-required="element.ariaRequired"
    :aria-invalid="element.ariaInvalid"
    :aria-labelledby="element.ariaLabelledBy"
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
    <div
      :class="getContentClass(element) || undefined"
      v-show="!element.isCollapsed"
      role="presentation"
    >
      <survey-errors
        v-if="hasErrorsOnTop"
        :element="element"
        :location="'top'"
      />

      <component
        :is="contentComponentName"
        v-if="!element.isCollapsed"
        v-bind="contentComponentData"
      />
      <div v-if="element.hasComment" :class="element.getCommentAreaCss()">
        <div>
          <survey-string :locString="element.locCommentText" />
        </div>
        <survey-question-comment
          :commentClass="css.comment"
          :question="element"
        />
      </div>
      <survey-errors
        v-if="hasErrorsOnBottom"
        :element="element"
        :location="'bottom'"
      />
      <div
        v-if="element.hasDescriptionUnderInput"
        :class="element.cssClasses.descriptionUnderInput"
      >
        <survey-string :locString="element.locDescription" />
      </div>
    </div>
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

  <component
    v-else-if="!!element.skeletonComponentName"
    :is="element.skeletonComponentName"
    :element="element"
    :css="css"
  ></component>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import type { SurveyModel, Question, QuestionRowModel } from "survey-core";
import { useBase } from "./base";
import { computed, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  survey: SurveyModel;
  element: Question;
  row: QuestionRowModel;
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
    (
      props.element.survey as SurveyModel
    ).getQuestionContentWrapperComponentName(props.element) ||
    componentName.value
  );
});
const contentComponentData = computed(() => {
  return {
    componentName: componentName.value,
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
