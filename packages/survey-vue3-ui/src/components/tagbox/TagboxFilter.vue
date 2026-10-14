<template>
  <div :class="question.cssClasses.hint">
    <div v-if="renderState.showHintPrefix" :class="question.cssClasses.hintPrefix">
      <span>{{ renderState.hintStringPrefix }}</span>
    </div>

    <div :class="question.cssClasses.hintSuffixWrapper">
      <SvComponent
        :is="'survey-string'"
        v-if="question.showSelectedItemLocText"
        :locString="question.selectedItemLocText"
      />
      <div v-if="renderState.showHintString" :class="question.cssClasses.hintSuffix">
        <span style="visibility: hidden">{{ renderState.inputStringRendered }}</span>
        <span>{{ renderState.hintStringSuffix }}</span>
      </div>
      <input
        type="text"
        autocomplete="off"
        v-model="renderedValue"
        :class="question.cssClasses.filterStringInput"
        :placeholder="renderState.filterStringPlaceholder"
        :disabled="question.isDisabledAttr"
        :inputmode="renderState.inputMode"
        :role="renderState.ariaInputRole"
        :aria-required="renderState.ariaInputRequired"
        :aria-invalid="renderState.ariaInputInvalid"
        :aria-errormessage="renderState.ariaInputErrorMessage"
        :aria-expanded="renderState.ariaInputExpanded"
        :aria-label="renderState.ariaInputLabel"
        :aria-labelledby="renderState.ariaInputLabelledby"
        :aria-describedby="renderState.ariaInputDescribedby"
        :aria-controls="renderState.ariaInputControls"
        :aria-activedescendant="renderState.ariaInputActivedescendant"
        :id="question.getInputId()"
        :readonly="renderState.filterReadOnly ? true : undefined"
        :size="!renderState.inputStringRendered ? 1 : undefined"
        @change="inputChange"
        @keydown="inputKeyHandler"
        @blur="blur"
        @focus="focus"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import type {
  DropdownMultiSelectListModel,
  DropdownMultiSelectRenderState,
  QuestionTagboxModel,
} from "survey-core";
import { computed } from "vue";

const props = defineProps<{
  question: QuestionTagboxModel;
  model?: DropdownMultiSelectListModel;
}>();
// The model is passed once it exists; the closed control is rendered from the render state.
const renderState = computed<DropdownMultiSelectRenderState>(() => {
  return props.question.dropdownRenderState as DropdownMultiSelectRenderState;
});
const inputChange = (event: any) => {
  const model = props.question.dropdownListModel;
  model.inputStringRendered = event.target.value;
};
const inputKeyHandler = (event: any) => {
  props.question.dropdownListModel.inputKeyHandler(event);
};
const blur = (event: any) => {
  props.question.onBlur(event);
};
const focus = (event: any) => {
  props.question.onFocus(event);
};
const renderedValue = computed({
  get() {
    return renderState.value.inputStringRendered ?? "";
  },
  set(val) {
    const model = props.question.dropdownListModel;
    model.inputStringRendered = val;
  },
});

useBase(() => props.model);
</script>
