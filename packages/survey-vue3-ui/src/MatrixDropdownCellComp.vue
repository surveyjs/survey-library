<template>
  <td
    :class="cell.className"
    :title="cell.getTitle()"
    :style="(getCellStyle() as StyleValue)"
    :colspan="cell.colSpans"
    v-on:focusin="cell.focusIn()"
    ref="root"
  >
    <SurveyVueComponent
      :name="'survey-errors'"
      v-if="cell.isErrorsCell"
      :element="cell.question"
    />
    <SurveyVueComponent
      :name="'sv-matrix-drag-drop-icon'"
      v-if="cell.isDragHandlerCell"
      :item="{ data: { row: cell.row, question: question } }"
    ></SurveyVueComponent>
    <SurveyVueComponent
      :name="'sv-action-bar'"
      v-if="cell.isActionsCell"
      :model="cell.item.getData()"
      :handleClick="false"
    ></SurveyVueComponent>
    <SurveyVueComponent
      v-if="cell.hasPanel"
      :name="panelComponentName"
      v-bind="panelComponentData"
    ></SurveyVueComponent>
    <span v-if="cell.showResponsiveTitle" :class="cell.responsiveTitleCss">
      <SurveyVueComponent
        :name="'survey-string'"
        :locString="cell.responsiveLocTitle"
      />
    </span>
    <div
      v-if="cell.hasQuestion"
      :class="cell.cellQuestionWrapperClassName"
      v-show="isVisible"
    >
      <SurveyVueComponent
        v-if="!cell.isChoice && cell.question.isDefaultRendering()"
        :name="question.getCellWrapperComponentName(cell.cell)"
        :componentData="question.getCellWrapperComponentData(cell.cell)"
      >
        <SurveyVueComponent
          :name="getComponentName(cell.question)"
          :question="cell.question"
        />
      </SurveyVueComponent>
      <SurveyVueComponent
        v-if="!cell.isChoice && !cell.question.isDefaultRendering()"
        :name="cell.question.getComponentName()"
        :question="cell.question"
      />
      <SurveyVueComponent
        v-if="cell.isItemChoice"
        :name="question.getCellWrapperComponentName(cell.cell)"
        :componentData="question.getCellWrapperComponentData(cell.cell)"
      >
        <SurveyVueComponent
          :name="'survey-radiogroup-item'"
          v-if="cell.isRadio"
          :key="cell.item.value"
          :question="cell.question"
          :item="cell.item"
          :hideLabel="true"
        ></SurveyVueComponent>
        <SurveyVueComponent
          :name="'survey-checkbox-item'"
          v-if="cell.isCheckbox"
          :key="cell.item.value"
          :question="cell.question"
          :item="cell.item"
          :hideLabel="true"
        ></SurveyVueComponent>
      </SurveyVueComponent>
      <SurveyVueComponent
        :name="'survey-other-choice'"
        v-if="cell.isOtherChoice"
        :question="cell.question"
      />
    </div>
    <template v-if="cell.hasTitle">
      <SurveyVueComponent
        :name="question.getCellWrapperComponentName(cell)"
        :componentData="question.getCellWrapperComponentData(cell)"
      >
        <SurveyVueComponent
          :name="'survey-string'"
          v-if="cell.hasTitle"
          :locString="cell.locTitle"
        />
        <span
          v-if="!!cell.requiredText"
          :class="question.cssClasses.cellRequiredText"
          >{{ cell.requiredText }}</span
        >
      </SurveyVueComponent>
    </template>
  </td>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import type {
  Question,
  QuestionMatrixDropdownRenderedCell,
  SurveyModel,
} from "survey-core";
import { getComponentName as getComponent } from "./base";
import { ref, onMounted, type StyleValue, computed } from "vue";

const props = defineProps<{
  question: Question;
  cell: QuestionMatrixDropdownRenderedCell;
}>();
const isVisible = ref(false);
const root = ref<HTMLElement>();

const getCellStyle = () => {
  if (!!props.cell.width || !!props.cell.minWidth)
    return { width: props.cell.width, minWidth: props.cell.minWidth };
  return null;
};
const onVisibilityChanged = () => {
  if (!props.cell.hasQuestion || !props.question || !props.question.survey)
    return;
  isVisible.value = props.cell.question.isVisible;
};
const getComponentName = (element: Question | any) => {
  return getComponent(element);
};
onVisibilityChanged();
onMounted(() => {
  if (!props.cell.hasQuestion || !props.question || !props.question.survey)
    return;
  props.cell.question.registerPropertyChangedHandlers(["isVisible"], () => {
    onVisibilityChanged();
  });
  const el = root.value;
  const cQ = props.cell.question;
  const options = {
    cell: props.cell.cell,
    cellQuestion: cQ,
    htmlElement: el,
    row: props.cell.row,
    column: props.cell.cell.column,
  };
  props.question.survey.matrixAfterCellRender(props.question, options);
  if (cQ) {
    cQ.afterRenderCore(el);
  }
});
const panelComponentName = computed(() => {
  const cell = props.cell;
  if (cell.hasPanel) {
    const panel = cell.panel;
    const survey = panel.survey as SurveyModel;
    if (survey) {
      const name = survey.getElementWrapperComponentName(panel);
      if (name) {
        return name;
      }
    }
    return "survey-panel";
  }
  return undefined;
});
const panelComponentData = computed(() => {
  const cell = props.cell;
  if (cell.hasPanel) {
    const panel = props.cell.panel;
    const survey = panel.survey as SurveyModel;
    let data: any;
    if (survey) {
      data = survey.getElementWrapperComponentData(panel);
    }
    return {
      componentName: "survey-panel",
      componentData: {
        element: panel,
        data: data,
        css: props.question.cssClasses,
      },
    };
  }
  return undefined;
});
</script>
