<template>
  <div :class="question.cssClasses.selectWrapper" @click="click">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      :tabindex="renderState.noTabIndex ? undefined : 0"
      v-bind:disabled="question.isDisabledAttr ? true : null"
      @keydown="keyhandler"
      @blur="blur"
      :class="question.getControlClass()"
      :role="renderState.ariaQuestionRole"
      :aria-required="renderState.ariaQuestionRequired"
      :aria-label="renderState.ariaQuestionLabel" 
      :aria-labelledby="renderState.ariaQuestionLabelledby" 
      :aria-describedby="renderState.ariaQuestionDescribedby" 
      :aria-invalid="renderState.ariaQuestionInvalid"
      :aria-errormessage="renderState.ariaQuestionErrorMessage" 
      :aria-controls="renderState.ariaQuestionControls"
      :aria-expanded="renderState.ariaQuestionExpanded"
      :aria-activedescendant="renderState.ariaQuestionActivedescendant"
      :required="question.isRequired ? true : null"
    >
      <div :class="question.cssClasses.controlValue">
        <SvComponent
          :is="'sv-tagbox-item'"
          v-for="(item, index) in question.selectedChoices"
          :item="item"
          :question="question"
          :key="'item' + index"
        ></SvComponent>
        <SvComponent
          :is="'sv-tagbox-filter'"
          v-if="renderState.needRenderInput"
          :model="stateModel"
          :question="question"
        ></SvComponent>
      </div>
      <SvComponent :is="'sv-action-bar'" :model="renderState.editorButtons" />
    </div>
    <SvComponent
      :is="'sv-popup'"
      v-if="!question.isInputReadOnly"
      :model="question.dropdownListModel.popupModel"
    ></SvComponent>
    <div
      v-if="question.isReadOnly"
      :id="question.inputId"
      :role="renderState.ariaQuestionRole"
      :aria-label="renderState.ariaQuestionLabel"
      :aria-labelledby="renderState.ariaQuestionLabelledby"
      :aria-describedby="renderState.ariaQuestionDescribedby"
      :aria-expanded="false"
      :aria-readonly="true"
      :aria-disabled="true"
      :tabindex="question.isDisabledAttr ? undefined : 0"
      :class="question.getControlClass()"
    >
      <div v-if="question.readOnlyText" :class="question.cssClasses.controlValue">
        <SvComponent :is="'survey-string'" :locString="question.locReadOnlyText" />
      </div>
      <SvComponent :is="'sv-action-bar'" :model="renderState.editorButtons" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import type { DropdownMultiSelectListModel, QuestionTagboxModel } from "survey-core";
import { computed, ref } from "vue";

const props = defineProps<{ question: QuestionTagboxModel }>();
// The closed control is rendered from the render state, which does not create DropdownListModel.
const renderState = computed(() => {
  return props.question.dropdownRenderState;
});
// The model is created when the popup is rendered (an editable control) or on an interaction.
// modelVersion is bumped after an interaction, so useBase subscribes to a model created by it.
const modelVersion = ref(0);
const stateModel = computed<DropdownMultiSelectListModel>(() => {
  return modelVersion.value >= 0 && props.question.isInputReadOnly ? props.question.dropdownListModelValue as DropdownMultiSelectListModel : props.question.dropdownListModel;
});
const click = (event: any) => {
  props.question.dropdownListModel?.onClick(event);
  modelVersion.value++;
};
const keyhandler = (event: any) => {
  props.question.dropdownListModel?.keyHandler(event);
  modelVersion.value++;
};
const blur = (event: any) => {
  props.question.dropdownListModelValue?.onBlur(event);
};
useBase(() => stateModel.value);
</script>
