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
    :aria-label="element.ariaLabel"
    :aria-labelledby="element.ariaLabelledBy"
    :aria-describedby="element.ariaDescribedBy"
    :aria-expanded="element.ariaExpanded"
    :data-name="element.name"
  >
    <SvComponent
      :is="'sv-breadcrumbs'"
      v-if="element.singleInputHasActions"
      :model="element.singleInputActions"
      :css="element.cssClasses"
    />
    <SvComponent
      :is="'survey-errors'"
      v-if="element.showErrorsAboveQuestion"
      :element="element"
      :location="'top'"
    />
    <SvComponent
      :is="'survey-element-header'"
      v-if="!element.singleInputHideHeader && element.hasTitleOnLeftTop"
      :element="element"
      :css="element.cssClasses"
    />
    <SvComponent
      :is="'sv-single-input-summary'"
      v-if="element.singleInputSummary"
      :css="element.cssClasses"
      :summary="element.singleInputSummary"
    ></SvComponent>
    <SvComponent
      :is="'survey-question'"
      v-else-if="singleQuestion"
      :css="css"
      :element="singleQuestion"
      :survey="survey"
      :key="(singleQuestion as any).id"
    ></SvComponent>
    <SvComponent
      v-else
      :is="contentComponentName"
      v-bind="contentComponentData"
    >
      <div
        :class="getContentClass(element) || undefined"
        :style="{ display: !element.renderedIsExpanded ? 'none' : undefined }"
        role="presentation"
      >
        <SvComponent :is="componentName" :question="element" />
        <div v-if="element.hasComment" :class="element.getCommentAreaCss()">
          <div>
            <SvComponent
              :is="'survey-string'"
              :locString="element.locCommentText"
            />
          </div>
          <SvComponent :is="'survey-question-comment'" :question="element" />
        </div>
        <div
          v-if="element.hasDescriptionUnderInput"
          :class="element.cssDescription"
          :id="element.ariaDescriptionId"
        >
          <SvComponent
            :is="'survey-string'"
            :locString="element.locDescription"
          />
        </div>
      </div>
    </SvComponent>
    <SvComponent
      :is="'survey-element-header'"
      v-if="element.hasTitleOnBottom"
      :element="element"
      :css="css"
    />
    <SvComponent
      :is="'survey-errors'"
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
import SvComponent from "@/SvComponent.vue";
import type { SurveyModel, Question } from "survey-core";
import { useBase } from "./base";
import { computed, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  survey: SurveyModel;
  element: Question;
  css?: any;
}>();
const root = ref<HTMLElement>(null as any);
const getContentClass = (element: Question) => {
  return element.cssContent;
};
const getRootStyle: () => any = () => props.element.getRootStyle();
const singleQuestion = computed(() => {
  return props.element.singleInputQuestion;
});
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
