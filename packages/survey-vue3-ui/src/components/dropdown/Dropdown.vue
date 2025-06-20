<template>
  <div :class="question.cssClasses.selectWrapper" @click="click">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      :disabled="question.isDisabledAttr ? true : null"
      :tabindex="model.noTabIndex ? undefined : 0"
      @keydown="keyhandler"
      @blur="blur"
      :class="question.getControlClass()"
      :role="model.ariaQuestionRole"
      :aria-required="model.ariaQuestionRequired"
      :aria-invalid="model.ariaQuestionInvalid"
      :aria-errormessage="model.ariaQuestionErrorMessage" 
      :aria-expanded="model.ariaQuestionExpanded"
      :aria-label="model.ariaQuestionLabel" 
      :aria-labelledby="model.ariaQuestionLabelledby"
      :aria-describedby="model.ariaQuestionDescribedby"
      :aria-controls="model.ariaQuestionControls"
      :aria-activedescendant="model.ariaQuestionActivedescendant"
      :required="question.isRequired ? true : null"
    >
      <div v-if="model.showHintPrefix" :class="question.cssClasses.hintPrefix">
        <span>{{ model.hintStringPrefix }}</span>
      </div>

      <div :class="question.cssClasses.controlValue">
        <SvComponent
          :is="'survey-string'"
          v-if="showSelectedItemLocText"
          :locString="selectedItemLocText"
        />
        <div
          v-if="model.showHintString"
          :class="question.cssClasses.hintSuffix"
        >
          <span style="visibility: hidden">{{
            model.inputStringRendered
          }}</span>
          <span>{{ model.hintStringSuffix }}</span>
        </div>
        <SvComponent
          v-if="question.showInputFieldComponent"
          :is="question.inputFieldComponentName"
          :item="model.getSelectedAction()"
          :question="question"
        >
        </SvComponent>
        <input
          v-if="model.needRenderInput"
          type="text"
          ref="inputElement"
          v-bind:class="question.cssClasses.filterStringInput"
          v-bind:disabled="question.isDisabledAttr"
          autocomplete="off"
          :inputmode="model.inputMode"
          :id="question.getInputId()"
          :tabindex="model.noTabIndex ? undefined : -1"
          :readonly="model.filterReadOnly ? true : undefined"
          :role="model.ariaInputRole"
          :aria-required="model.ariaInputRequired"
          :aria-invalid="model.ariaInputInvalid"
          :aria-errormessage="model.ariaInputErrorMessage"
          :aria-expanded="model.ariaInputExpanded"
          :aria-controls="model.ariaInputControls"
          :aria-label="model.ariaInputLabel"
          :aria-labelledby="model.ariaInputLabelledby"
          :aria-describedby="model.ariaInputDescribedby"
          :aria-activedescendant="model.ariaInputActivedescendant"
          :placeholder="model.placeholderRendered"
          @input="inputChange"
          @blur="blur"
          @focus="focus"
        />
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
      <div :class="question.cssClasses.controlValue">
        <SvComponent
          :is="'survey-string'"
          v-if="question.locReadOnlyText"
          :locString="question.locReadOnlyText"
        />
      </div>
      <SvComponent :is="'sv-action-bar'" :model="model.editorButtons" />
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
const model = computed(() => {
  return props.question.dropdownListModel;
});
const click = (event: any) => {
  model.value?.onClick(event);
};
const keyhandler = (event: any) => {
  model.value?.keyHandler(event);
};
const updateInputDomElement = () => {
  if (inputElement.value) {
    const control: any = inputElement.value;
    const newValue = model.value.inputStringRendered;
    if (
      !Helpers.isTwoValueEquals(newValue, control.value, false, true, false)
    ) {
      control.value = model.value.inputStringRendered;
    }
  }
};
const blur = (event: any) => {
  props.question.onBlur(event);
  updateInputDomElement();
};
const focus = (event: any) => {
  props.question.onFocus(event);
};
const inputChange = (event: any) => {
  model.value.inputStringRendered = event.target.value;
};

const showSelectedItemLocText = computed(
  () => props.question.showSelectedItemLocText
);
const selectedItemLocText = computed(() => props.question.selectedItemLocText);

useBase(() => model.value);

onUpdated(updateInputDomElement);
onMounted(updateInputDomElement);
</script>
