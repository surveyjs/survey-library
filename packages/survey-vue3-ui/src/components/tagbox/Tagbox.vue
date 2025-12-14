<template>
  <div :class="question.cssClasses.selectWrapper" @click="click">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      :tabindex="model.noTabIndex ? undefined : 0"
      v-bind:disabled="question.isDisabledAttr ? true : null"
      @keydown="keyhandler"
      @blur="blur"
      :class="question.getControlClass()"
      :role="model.ariaQuestionRole"
      :aria-required="model.ariaQuestionRequired"
      :aria-label="model.ariaQuestionLabel" 
      :aria-labelledby="model.ariaQuestionLabelledby" 
      :aria-describedby="model.ariaQuestionDescribedby" 
      :aria-invalid="model.ariaQuestionInvalid"
      :aria-errormessage="model.ariaQuestionErrorMessage" 
      :aria-controls="model.ariaQuestionControls"
      :aria-expanded="model.ariaQuestionExpanded"
      :aria-activedescendant="model.ariaQuestionActivedescendant"
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
          v-if="model.needRenderInput"
          :model="model"
          :question="question"
        ></SvComponent>
      </div>
      <SvComponent :is="'sv-action-bar'" :model="model.editorButtons" />
    </div>
    <SvComponent
      :is="'sv-popup'"
      v-if="!question.isInputReadOnly"
      :model="model.popupModel"
    ></SvComponent>
    <div
      v-if="question.isReadOnly"
      :id="question.inputId"
      :role="model?.ariaQuestionRole"
      :aria-label="model?.ariaQuestionLabel"
      :aria-labelledby="model?.ariaQuestionLabelledby"
      :aria-describedby="model?.ariaQuestionDescribedby"
      :aria-expanded="false"
      :aria-readonly="true"
      :aria-disabled="true"
      :tabindex="question.isDisabledAttr ? undefined : 0"
      :class="question.getControlClass()"
    >
      <div v-if="question.readOnlyText" :class="question.cssClasses.controlValue">
        <SvComponent :is="'survey-string'" :locString="question.locReadOnlyText" />
      </div>
      <SvComponent :is="'sv-action-bar'" :model="model.editorButtons" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import { DropdownMultiSelectListModel, QuestionTagboxModel } from "survey-core";
import { computed } from "vue";

const props = defineProps<{ question: QuestionTagboxModel }>();
const model = computed(() => {
  const question = props.question;
  if (!question.dropdownListModel) {
    question.dropdownListModel = new DropdownMultiSelectListModel(question);
  }
  return props.question.dropdownListModel;
});
const click = (event: any) => {
  model.value?.onClick(event);
};
const keyhandler = (event: any) => {
  model.value?.keyHandler(event);
};
const blur = (event: any) => {
  model.value?.onBlur(event);
};
useBase(() => model.value);
</script>
