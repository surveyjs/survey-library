<template>
  <td
    :class="cell.className"
    :data-responsive-title="getHeaders()"
    :title="cell.getTitle()"
    :style="(getCellStyle() as StyleValue)"
    :colspan="cell.colSpans"
    v-on:focusin="cell.focusIn()"
    ref="root"
  >
    <survey-errors v-if="cell.isErrorsCell" :element="cell.question" />
    <sv-matrix-drag-drop-icon
      v-if="cell.isDragHandlerCell"
      :item="{ data: { row: cell.row, question: question } }"
    ></sv-matrix-drag-drop-icon>
    <sv-action-bar
      v-if="cell.isActionsCell"
      :model="cell.item.getData()"
      :handleClick="false"
    ></sv-action-bar>
    <component
      v-if="cell.hasPanel"
      :is="panelComponentName"
      v-bind="panelComponentData"
    ></component>
    <div
      v-if="cell.hasQuestion"
      :class="cell.cellQuestionWrapperClassName"
      v-show="isVisible"
    >
      <component
        v-if="!cell.isChoice && cell.question.isDefaultRendering()"
        :is="question.getCellWrapperComponentName(cell.cell)"
        :componentData="question.getCellWrapperComponentData(cell.cell)"
      >
        <component
          :is="getComponentName(cell.question)"
          :question="cell.question"
        />
      </component>
      <component
        v-if="!cell.isChoice && !cell.question.isDefaultRendering()"
        :is="cell.question.getComponentName()"
        :question="cell.question"
      />
      <component
        v-if="cell.isItemChoice"
        :is="question.getCellWrapperComponentName(cell.cell)"
        :componentData="question.getCellWrapperComponentData(cell.cell)"
      >
        <survey-radiogroup-item
          v-if="cell.isRadio"
          :key="cell.item.value"
          :question="cell.question"
          :item="cell.item"
          :hideLabel="true"
        ></survey-radiogroup-item>
        <survey-checkbox-item
          v-if="cell.isCheckbox"
          :key="cell.item.value"
          :question="cell.question"
          :item="cell.item"
          :hideLabel="true"
        ></survey-checkbox-item>
      </component>
      <survey-other-choice
        v-if="cell.isOtherChoice"
        :question="cell.question"
      />
    </div>
    <template v-if="cell.hasTitle">
      <component
        :is="question.getCellWrapperComponentName(cell)"
        :componentData="question.getCellWrapperComponentData(cell)"
      >
        <survey-string v-if="cell.hasTitle" :locString="cell.locTitle" />
        <span
          v-if="!!cell.requiredText"
          :class="question.cssClasses.cellRequiredText"
          >{{ cell.requiredText }}</span
        >
      </component>
    </template>
  </td>
</template>

<script lang="ts" setup>
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

const getHeaders = () => props.cell.headers;
const getCellStyle = () => {
  if (!!props.cell.width || !!props.cell.minWidth)
    return { width: props.cell.width, minWidth: props.cell.minWidth };
  return null;
};
const getCellIndex = () => (props.cell as any).index || "";
const onVisibilityChanged = () =>
  (isVisible.value = props.cell.question.isVisible);
const getComponentName = (element: Question | any) => {
  return getComponent(element);
};

onMounted(() => {
  if (!props.cell.hasQuestion || !props.question || !props.question.survey)
    return;
  onVisibilityChanged();
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
