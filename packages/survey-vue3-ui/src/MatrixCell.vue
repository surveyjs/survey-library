<template>
  <label
    @mousedown="question.onMouseDown()"
    :class="question.getItemClass(row, column)"
  >
    <input
      type="question.checkType"
      :class="question.cssItemValue"
      :name="row.fullName"
      v-model="renderedValue"
      @change="changed"
      :value="column.value"
      :readonly="row.isReadOnlyAttr"
      :disabled="row.isDisabledAttr"
      :id="question.inputId + '_' + row.name + '_' + columnIndex"
      :aria-required="question.a11y_input_ariaRequired"
      :aria-label="
        question.getCellAriaLabel(row, column)
      "
      :aria-invalid="question.a11y_input_ariaInvalid"
      :aria-errormessage="question.a11y_input_ariaErrormessage"
    />
    <span :class="question.cssMaterialDecorator">
      <svg
        v-if="itemSvgIcon()"
        :class="question.cssItemDecorator"
      >
        <use :xlink:href="itemSvgIcon()"></use>
      </svg>
    </span>
    <span
      v-if="question.isMobile"
      :class="question.cssClasses.cellResponsiveTitle"
    >
      <SvComponent
        :is="'survey-string'"
        :locString="column.locText"
      ></SvComponent>
    </span>
  </label>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type {
  MatrixRowModel,
  ItemValue,
  QuestionMatrixModel,
} from "survey-core";

defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  question: QuestionMatrixModel;
  row: MatrixRowModel;
  column: ItemValue;
  columnIndex: number;
}>();
const renderedValue = props.row.isChecked(props.column) ? props.column.value : "";
const changed = () => {
  const row = props.row;
  const column = props.column;
  row.cellClick(column);
}
const itemSvgIcon = () => { return props.question.getItemSvgIcon(row, column); };
</script>
