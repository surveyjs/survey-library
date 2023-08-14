<template>
  <td
    :class="cell.className"
    :data-responsive-title="getHeaders()"
    :title="cell.getTitle()"
    :style="(getCellStyle() as StyleValue)"
    :colspan="cell.colSpans"
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
      :is="getComponentName(cell.panel)"
      :question="cell.panel"
      :css="question.cssClasses"
    ></component>
    <div
      v-if="cell.hasQuestion"
      :class="question.cssClasses.cellQuestionWrapper"
    >
      <component
        v-if="!cell.isChoice && cell.question.isDefaultRendering()"
        v-show="isVisible"
        :is="getComponentName(cell.question)"
        :question="cell.question"
      />
      <component
        v-if="!cell.isChoice && !cell.question.isDefaultRendering()"
        v-show="isVisible"
        :is="cell.question.getComponentName()"
        :question="cell.question"
      />
      <survey-radiogroup-item
        v-if="cell.isRadio"
        :key="cell.item.value"
        :class="cell.question.getItemClass(cell.item)"
        :question="cell.question"
        :item="cell.item"
        :index="getCellIndex()"
        :hideLabel="true"
      ></survey-radiogroup-item>
      <survey-checkbox-item
        v-if="cell.isCheckbox"
        :key="cell.item.value"
        :class="cell.question.getItemClass(cell.item)"
        :question="cell.question"
        :item="cell.item"
        :index="getCellIndex()"
        :hideLabel="true"
      ></survey-checkbox-item>
      <survey-other-choice
        v-if="cell.isOtherChoice"
        :question="cell.question"
      />
    </div>
    <survey-string v-if="cell.hasTitle" :locString="cell.locTitle" />
    <span
      v-if="!!cell.requiredText"
      :class="question.cssClasses.cellRequiredText"
      >{{ cell.requiredText }}</span
    >
  </td>
</template>

<script lang="ts" setup>
import type { Question, QuestionMatrixDropdownRenderedCell } from "survey-core";
import { getComponentName as getComponent } from "./base";
import { ref, onMounted, type StyleValue } from "vue";

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
  var options = {
    cell: props.cell.cell,
    cellQuestion: props.cell.question,
    htmlElement: root.value,
    row: props.cell.row,
    column: props.cell.cell.column,
  };
  props.question.survey.matrixAfterCellRender(props.question, options);
});
</script>
