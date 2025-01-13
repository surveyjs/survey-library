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
      :readonly="row.isReadOnlyAttr"
      :disabled="row.isDisabledAttr"
      :id="question.inputId + '_' + row.name + '_' + columnIndex"
      :aria-required="question.a11y_input_ariaRequired"
      :aria-label="
        question.getCellAriaLabel(
          row.locText.renderedHtml,
          column.locText.renderedHtml
        )
      "
      :aria-invalid="question.a11y_input_ariaInvalid"
      :aria-errormessage="question.a11y_input_ariaErrormessage"
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
defineProps<{
  question: QuestionMatrixModel;
  row: MatrixRowModel;
  column: ItemValue;
  columnIndex: number;
}>();
</script>
