<template>
  <div :class="question.cssClasses.hint">
    <div v-if="model.showHintPrefix" :class="question.cssClasses.hintPrefix">
      <span>{{ model.hintStringPrefix }}</span>
    </div>

    <div :class="question.cssClasses.hintSuffixWrapper">
      <SvComponent
        :is="'survey-string'"
        v-if="question.showSelectedItemLocText"
        :locString="question.selectedItemLocText"
      />
      <div v-if="model.showHintString" :class="question.cssClasses.hintSuffix">
        <span style="visibility: hidden">{{ model.inputStringRendered }}</span>
        <span>{{ model.hintStringSuffix }}</span>
      </div>
      <input
        type="text"
        autocomplete="off"
        v-model="model.inputStringRendered"
        :class="question.cssClasses.filterStringInput"
        :placeholder="model.filterStringPlaceholder"
        :disabled="question.isDisabledAttr"
        :inputmode="model.inputMode"
        :role="model.filterStringEnabled ? question.ariaRole : undefined"
        :aria-expanded="question.ariaExpanded"
        :aria-controls="model.listElementId"
        :aria-label="question.a11y_input_ariaLabel"
        :aria-labelledby="question.a11y_input_ariaLabelledBy"
        :aria-describedby="question.a11y_input_ariaDescribedBy"
        :aria-activedescendant="model.ariaActivedescendant"
        :id="question.getInputId()"
        :readonly="model.filterReadOnly ? true : undefined"
        :size="!model.inputStringRendered ? 1 : undefined"
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
  QuestionTagboxModel,
} from "survey-core";

const props = defineProps<{
  question: QuestionTagboxModel;
  model: DropdownMultiSelectListModel;
}>();
const inputChange = (event: any) => {
  const model = props.model;
  model.inputStringRendered = event.target.value;
};
const inputKeyHandler = (event: any) => {
  props.model.inputKeyHandler(event);
};
const blur = (event: any) => {
  props.question.onBlur(event);
};
const focus = (event: any) => {
  props.question.onFocus(event);
};

useBase(() => props.model);
</script>
