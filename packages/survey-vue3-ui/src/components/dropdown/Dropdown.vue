<template>
  <div :class="question.cssClasses.selectWrapper" @click="click">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      :disabled="question.isDisabledAttr ? true : null"
      :tabindex="renderState.noTabIndex ? undefined : 0"
      @keydown="keyhandler"
      @blur="blur"
      :class="question.getControlClass()"
      :role="renderState.ariaQuestionRole"
      :aria-required="renderState.ariaQuestionRequired"
      :aria-invalid="renderState.ariaQuestionInvalid"
      :aria-errormessage="renderState.ariaQuestionErrorMessage" 
      :aria-expanded="renderState.ariaQuestionExpanded"
      :aria-label="renderState.ariaQuestionLabel" 
      :aria-labelledby="renderState.ariaQuestionLabelledby"
      :aria-describedby="renderState.ariaQuestionDescribedby"
      :aria-controls="renderState.ariaQuestionControls"
      :aria-activedescendant="renderState.ariaQuestionActivedescendant"
      :required="question.isRequired ? true : null"
    >
      <div :class="question.cssClasses.controlValue">
        <div v-if="renderState.showHintPrefix" :class="question.cssClasses.hintPrefix">
          <span>{{ renderState.hintStringPrefix }}</span>
        </div>

        <div :class="question.cssClasses.inputPrefixWrapper">
          <SvComponent
            :is="'survey-string'"
            v-if="showSelectedItemLocText"
            :locString="selectedItemLocText"
          />
          <div
            v-if="renderState.showHintString"
            :class="question.cssClasses.hintSuffix"
          >
            <span style="visibility: hidden">{{
              renderState.inputStringRendered
            }}</span>
            <span>{{ renderState.hintStringSuffix }}</span>
          </div>
          <SvComponent
            v-if="question.showInputFieldComponent"
            :is="question.inputFieldComponentName"
            :item="renderState.getSelectedAction()"
            :question="question"
          >
          </SvComponent>
          <input
            v-if="renderState.needRenderInput"
            type="text"
            ref="inputElement"
            v-bind:class="question.cssClasses.filterStringInput"
            v-bind:disabled="question.isDisabledAttr"
            autocomplete="off"
            :inputmode="renderState.inputMode"
            :id="question.getInputId()"
            :tabindex="renderState.noTabIndex ? undefined : -1"
            :readonly="renderState.filterReadOnly ? true : undefined"
            :role="renderState.ariaInputRole"
            :aria-required="renderState.ariaInputRequired"
            :aria-invalid="renderState.ariaInputInvalid"
            :aria-errormessage="renderState.ariaInputErrorMessage"
            :aria-expanded="renderState.ariaInputExpanded"
            :aria-controls="renderState.ariaInputControls"
            :aria-label="renderState.ariaInputLabel"
            :aria-labelledby="renderState.ariaInputLabelledby"
            :aria-describedby="renderState.ariaInputDescribedby"
            :aria-activedescendant="renderState.ariaInputActivedescendant"
            :placeholder="renderState.placeholderRendered"
            @input="inputChange"
            @blur="blur"
            @focus="focus"
          />
        </div>
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
      <div
        v-if="question.showInputFieldComponent"
        :class="question.cssClasses.controlValue"
      >
        <SvComponent
          :is="question.inputFieldComponentName"
          :item="readonlySelectedItem"
          :question="question"
        />
      </div>
      <div
        v-else-if="question.readOnlyText"
        :class="question.cssClasses.controlValue"
      >
        <SvComponent :is="'survey-string'" :locString="question.locReadOnlyText" />
      </div>
      <SvComponent :is="'sv-action-bar'" :model="renderState.editorButtons" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import { Question, Helpers } from "survey-core";
import { computed, onMounted, onUpdated, ref } from "vue";

const props = defineProps<{ question: Question }>();
const inputElement = ref<HTMLElement>(null as any);
// The closed control is rendered from the render state, which does not create DropdownListModel.
const renderState = computed(() => {
  return props.question.dropdownRenderState || props.question.dropdownListModel;
});
// The model is created when the popup is rendered (an editable control) or on an interaction.
// modelVersion is bumped after an interaction, so useBase subscribes to a model created by it.
const modelVersion = ref(0);
const stateModel = computed(() => {
  return modelVersion.value >= 0 && props.question.isInputReadOnly ? props.question.dropdownListModelValue : props.question.dropdownListModel;
});
const click = (event: any) => {
  props.question.dropdownListModel?.onClick(event);
  modelVersion.value++;
};
const keyhandler = (event: any) => {
  props.question.dropdownListModel?.keyHandler(event);
  modelVersion.value++;
};
const updateInputDomElement = () => {
  if (inputElement.value) {
    const control: any = inputElement.value;
    const newValue = renderState.value.inputStringRendered;
    if (
      !Helpers.isTwoValueEquals(newValue, control.value, false, true, false)
    ) {
      control.value = renderState.value.inputStringRendered;
    }
  }
};
const blur = (event: any) => {
  props.question.onBlur(event);
  updateInputDomElement();
};
const focus = (event: any) => {
  props.question.onFocus(event);
  modelVersion.value++;
};
const inputChange = (event: any) => {
  const model = props.question.dropdownListModel;
  model.inputStringRendered = event.target.value;
};

const showSelectedItemLocText = computed(
  () => props.question.showSelectedItemLocText
);
const selectedItemLocText = computed(() => props.question.selectedItemLocText);
const readonlySelectedItem = computed(() => {
  const m = renderState.value;
  return m && typeof m.getSelectedAction === "function"
    ? m.getSelectedAction()
    : props.question.selectedItem;
});

useBase(() => stateModel.value);

onUpdated(updateInputDomElement);
onMounted(updateInputDomElement);
</script>
