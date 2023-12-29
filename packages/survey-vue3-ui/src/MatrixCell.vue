<template>
  <label
    @mousedown="question.onMouseDown()"
    :class="question.getItemClass(row, column)"
  >
    <input
      type="radio"
      :class="question.cssClasses.itemValue"
      :name="row.fullName"
      v-model="row.value"
      :value="column.value"
      :disabled="question.isInputReadOnly"
      :id="question.inputId + '_' + row.name + '_' + columnIndex"
      :aria-required="question.a11y_input_ariaRequired"
      :aria-label="
        question.getCellAriaLabel(
          row.locText.renderedHtml,
          column.locText.renderedHtml
        )
      "
      :aria-invalid="question.a11y_input_ariaInvalid"
      :aria-describedby="question.a11y_input_ariaDescribedBy"
    />
    <span :class="question.cssClasses.materialDecorator">
      <svg
        v-if="question.itemSvgIcon"
        :class="question.cssClasses.itemDecorator"
      >
        <use :xlink:href="question.itemSvgIcon"></use>
      </svg>
    </span>
    <span
      v-if="question.isMobile"
      :class="question.cssClasses.cellResponsiveTitle"
    >
      <survey-string :locString="column.locText"></survey-string>
    </span>
  </label>
</template>

<script lang="ts" setup>
import type {
  MatrixRowModel,
  ItemValue,
  QuestionMatrixModel,
} from "survey-core";
import { useQuestion } from "./base";
import { ref, shallowRef } from "vue";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  question: QuestionMatrixModel;
  row: MatrixRowModel;
  colum: ItemValue;
  columnIndex: number;
}>();
const root = ref(null);
const visibleRows = shallowRef();
useQuestion<QuestionMatrixModel>(
  props,
  root,
  (value) => {
    visibleRows.value = value.visibleRows;
    value.visibleRowsChangedCallback = () => {
      visibleRows.value = value.visibleRows;
    };
  },
  (value) => {
    value.visibleRowsChangedCallback = () => {};
  }
);

const cellClick = (row: any, column: any) => {
  if (props.question.isInputReadOnly) return;
  row.value = column.value;
};
</script>
