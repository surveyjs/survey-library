<template>
  <div
    :class="!element.isPanel ? (element as Question).getRootCss() : null"
    ref="root"
    v-if="row.isNeedRender"
    v-on:focusin="element.focusIn()"
    :id="element.id"
    :role="(element as Question).ariaRole"
    :aria-required="(element as Question).ariaRequired"
    :aria-invalid="(element as Question).ariaInvalid"
    :aria-labelledby="(element as Question).ariaLabelledBy"
    :data-name="element.name"
  >
    <survey-errors
      v-if="!element.isPanel && (element as Question).showErrorsAboveQuestion"
      :element="element"
      :location="'top'"
    />
    <survey-element-header
      v-if="!element.isPanel && (element as Question).hasTitleOnLeftTop"
      :element="element"
      :css="css"
    />
    <div
      :class="getContentClass((element as Question)) || undefined"
      v-show="element.isPanel || !element.isCollapsed"
      role="presentation"
    >
      <survey-errors
        v-if="hasErrorsOnTop"
        :element="element"
        :location="'top'"
      />
      <component
        :is="getComponentName((element as Question))"
        v-if="element.isPanel || !element.isCollapsed"
        :question="element"
      />
      <div
        v-if="(element as any).hasComment"
        :class="(element as Question).getCommentAreaCss()"
      >
        <div>
          <survey-string :locString="(element as Question).locCommentText" />
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
      <survey-errors
        v-if="!element.isPanel && element.isErrorsModeTooltip"
        :element="element"
        :location="'tooltip'"
      />
    </div>
    <survey-element-header
      v-if="!element.isPanel && (element as Question).hasTitleOnBottom"
      :element="element"
      :css="css"
    />
    <div
      v-if="!element.isPanel && (element as Question).hasDescriptionUnderInput"
      :class="element.cssClasses.descriptionUnderInput"
    >
      <survey-string :locString="element.locDescription" />
    </div>
    <survey-errors
      v-if="!element.isPanel && (element as Question).showErrorsBelowQuestion"
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

<script lang="ts" setup>
import type {
  SurveyModel,
  Question,
  QuestionRowModel,
  PanelModel,
} from "survey-core";
import { useBase } from "./base";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{
  survey: SurveyModel;
  element: Question | PanelModel;
  row: QuestionRowModel;
  css?: any;
}>();
const root = ref<HTMLElement>(null as any);
const hasErrorsOnTop = computed(() => {
  return !props.element.isPanel && (props.element as Question).showErrorOnTop;
});
const hasErrorsOnBottom = computed(() => {
  return (
    !props.element.isPanel && (props.element as Question).showErrorOnBottom
  );
});

const getComponentName = (element: Question) => {
  if (element.customWidget) return "survey-customwidget";
  if (element.getType() === "panel" || element.isDefaultRendering()) {
    return "survey-" + element.getTemplate();
  }
  return element.getComponentName();
};
const getContentClass = (element: Question) => {
  return element.cssContent;
};

useBase(() => props.element);

onMounted(() => {
  if (!props.element.isPanel) {
    (props.element as Question).afterRender(root.value as HTMLElement);
  }
});
</script>
